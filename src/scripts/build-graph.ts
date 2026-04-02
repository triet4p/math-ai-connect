import matter from 'gray-matter';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

type GraphNode = {
  id: string;
  label: string;
  type: 'post';
  url: string;
};

type GraphEdge = {
  source: string;
  target: string;
  type: 'reference';
};

type GraphPayload = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

type PostData = {
  title: string;
  draft?: boolean;
  refs?: string[];
};

function toPath(url: URL): string {
  return fileURLToPath(url);
}

async function getEntries<T extends { title: string; draft?: boolean }>() {
  const collectionDir = join(process.cwd(), 'src', 'content');
  let files: string[] = [];
  try {
    files = await readdir(collectionDir);
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
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
  const posts = await getEntries<PostData>();

  const nodes: GraphNode[] = [
    ...posts.map((entry) => ({
      id: `posts:${entry.slug}`,
      label: entry.data.title,
      type: 'post' as const,
      url: `/posts/${entry.slug}`
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

  for (const entry of posts) {
    for (const ref of entry.data.refs ?? []) {
      addEdge(`posts:${entry.slug}`, `posts:${ref}`, 'reference');
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
