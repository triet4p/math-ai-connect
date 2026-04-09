# Math AI Connect

Personal Knowledge Journal built with Astro.

Mục tiêu của project:

- Ghi chú toán học và AI trong một luồng bài viết thống nhất

## Tech Stack

- Astro 6
- MDX (`@astrojs/mdx`)
- Tailwind CSS 4 (`@tailwindcss/vite`)
- Math rendering (`remark-math`, `rehype-katex`)

## Routes

- `/` Home
- `/posts` Danh sách bài viết
- `/posts/[...slug]` Chi tiết bài viết
- `/plans` Danh mục thẻ/chủ đề đang có kế hoạch nghiên cứu

## Content Model

Schema định nghĩa tại `src/content.config.ts` với các collection:

- `posts`: bài viết chính (`.md/.mdx` trong `src/content`)
- `plannedTopics`: thẻ/chủ đề kế hoạch (`.json` trong `src/content/planned-topics`)

Quan trọng:

- `id` bài viết lấy từ tên file trong `src/content`
- Trường `refs` (nếu có) tham chiếu tới `id` bài viết khác
- Mỗi file JSON trong `src/content/planned-topics` là một chủ đề kế hoạch độc lập

Ví dụ `plannedTopics`:

```json
{
	"tag": "causal-inference",
	"note": "Nghiên cứu DAG, do-calculus và các bẫy suy luận tương quan.",
	"status": "planned",
	"priority": "high",
	"updatedAt": "2026-04-09"
}
```

Giá trị hợp lệ:

- `status`: `planned | researching | on-hold | done`
- `priority`: `high | medium | low`

Chi tiết đầy đủ cách viết frontmatter + MDX components:

- Xem `GUIDE.md`

## Project Structure

```text
.
├── .github/workflows/deploy.yml
├── public/
├── src/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   ├── pages/
│   └── content.config.ts
├── GUIDE.md
├── astro.config.mjs
└── package.json
```

## Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
```

## GitHub Pages Deployment

Workflow đã có sẵn tại:

- `.github/workflows/deploy.yml`

Trigger hiện tại:

- push vào `master` hoặc `main`

Checklist deploy:

1. Đảm bảo `astro.config.mjs` đúng:
	- `site`: `https://<username>.github.io`
	- `base`: `/<repo-name>`
2. Vào GitHub `Settings -> Pages`
3. Chọn `Source = GitHub Actions`
4. Push code lên `master` hoặc `main`
5. Theo dõi job trong tab `Actions`

## Notes

- Project đã xử lý base path cho GitHub Pages project-site (`/<repo-name>`).
- Nếu collection rỗng, build vẫn có thể thành công nhưng sẽ có cảnh báo thiếu dữ liệu.
