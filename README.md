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

## Content Model

Schema định nghĩa tại `src/content.config.ts` với collection `posts`.

Quan trọng:

- `id` bài viết lấy từ tên file trong `src/content`
- Trường `refs` (nếu có) tham chiếu tới `id` bài viết khác

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
