import matter from 'gray-matter';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

type GraphNode = {
  id: string;
  label: string;
  type: 'primitive' | 'research' | 'linking';
  url: string;
};

type GraphEdge = {
  source: string;
  target: string;
  type: 'connection' | 'primitiveRef' | 'researchRef';
};

type GraphPayload = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

type PrimitiveData = {
  title: string;
  draft?: boolean;
  connections?: string[];
};

type ResearchData = {
  title: string;
  draft?: boolean;
  primitiveRefs?: string[];
};

type LinkingData = {
  title: string;
  draft?: boolean;
  primitiveRefs?: string[];
  researchRefs?: string[];
};

function toPath(url: URL): string {
  return fileURLToPath(url);
}

async function getEntries<T extends { title: string; draft?: boolean }>(collectionName: string) {
  const collectionDir = join(process.cwd(), 'src', 'content', collectionName);
  const files = await readdir(collectionDir);
  const entries: { slug: string; data: T }[] = [];

  for (const file of files) {
    const ext = extname(file);
    if (ext !== '.md' && ext !== '.mdx') {
      continue;
    }

    const slug = file.replace(/\.(md|mdx)$/i, '');
    const raw = await readFile(join(collectionDir, file), 'utf8');
    const parsed = matter(raw);
    entries.push({ slug, data: parsed.data as T });
  }

  return entries.filter((entry) => entry.data.draft !== true);
}

export async function buildGraphData(distDir?: URL) {
  const [primitives, research, linking] = await Promise.all([
    getEntries<PrimitiveData>('primitives'),
    getEntries<ResearchData>('research'),
    getEntries<LinkingData>('linking')
  ]);

  const nodes: GraphNode[] = [
    ...primitives.map((entry) => ({
      id: `primitives:${entry.slug}`,
      label: entry.data.title,
      type: 'primitive' as const,
      url: `/primitives/${entry.slug}`
    })),
    ...research.map((entry) => ({
      id: `research:${entry.slug}`,
      label: entry.data.title,
      type: 'research' as const,
      url: `/research/${entry.slug}`
    })),
    ...linking.map((entry) => ({
      id: `linking:${entry.slug}`,
      label: entry.data.title,
      type: 'linking' as const,
      url: `/linking/${entry.slug}`
    }))
  ];

  const edgeKey = new Set<string>();
  const edges: GraphEdge[] = [];

  const addEdge = (source: string, target: string, type: GraphEdge['type']) => {
    const key = `${source}->${target}:${type}`;
    if (!edgeKey.has(key)) {
      edgeKey.add(key);
      edges.push({ source, target, type });
    }
  };

  for (const entry of primitives) {
    for (const connection of entry.data.connections ?? []) {
      addEdge(`primitives:${entry.slug}`, `primitives:${connection}`, 'connection');
    }
  }

  for (const entry of research) {
    for (const ref of entry.data.primitiveRefs ?? []) {
      addEdge(`research:${entry.slug}`, `primitives:${ref}`, 'primitiveRef');
    }
  }

  for (const entry of linking) {
    for (const primitiveRef of entry.data.primitiveRefs ?? []) {
      addEdge(`linking:${entry.slug}`, `primitives:${primitiveRef}`, 'primitiveRef');
    }
    for (const researchRef of entry.data.researchRefs ?? []) {
      addEdge(`linking:${entry.slug}`, `research:${researchRef}`, 'researchRef');
    }
  }

  const payload: GraphPayload = { nodes, edges };
  const serialized = `${JSON.stringify(payload, null, 2)}\n`;

  const publicPath = join(process.cwd(), 'public', 'graph.json');
  await mkdir(dirname(publicPath), { recursive: true });
  await writeFile(publicPath, serialized, 'utf8');

  if (distDir) {
    const distPath = join(toPath(distDir), 'graph.json');
    await writeFile(distPath, serialized, 'utf8');
  }
}
