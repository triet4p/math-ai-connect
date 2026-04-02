# Math AI Connect

Personal Knowledge Journal built with Astro.

Mục tiêu của project:

- Theo dõi primitive toán học nền tảng
- Ghi chú research/AI trend
- Viết các bài linking để nối ý giữa toán và ứng dụng

## Tech Stack

- Astro 6
- MDX (`@astrojs/mdx`)
- Tailwind CSS 4 (`@tailwindcss/vite`)
- Math rendering (`remark-math`, `rehype-katex`)
- Graph visualization (`d3-force`)

## Routes

- `/` Home
- `/primitives` Danh sách primitives
- `/primitives/[slug]` Chi tiết primitive
- `/research` Danh sách research
- `/research/[slug]` Chi tiết research
- `/linking` Danh sách linking notes
- `/linking/[slug]` Chi tiết linking note
- `/graph` Đồ thị kết nối nội dung

## Content Model

Schema định nghĩa tại `src/content.config.ts` với 3 collections:

- `primitives`
- `research`
- `linking`

Quan trọng:

- `id` bài viết lấy từ tên file trong thư mục content
- Các trường tham chiếu chéo (`connections`, `primitiveRefs`, `researchRefs`) phải dùng đúng `id`

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
│   │   ├── primitives/
│   │   ├── research/
│   │   └── linking/
│   ├── layouts/
│   ├── pages/
│   ├── scripts/
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
