# GUIDE.md

## Mục tiêu

Tài liệu này hướng dẫn cách viết bài `.mdx` đầy đủ cho project Knowledge Journal (Astro + Content Collections).

Bạn có 3 loại bài:

- `primitives`: ghi chú về nguyên thủy toán học
- `research`: ghi chú paper/research trend
- `linking`: bài nối ý giữa primitives và research

## Cấu trúc thư mục nội dung

Tạo file tại đúng thư mục sau:

- `src/content/primitives/<ten-bai>.mdx`
- `src/content/research/<ten-bai>.mdx`
- `src/content/linking/<ten-bai>.mdx`

Lưu ý:

- Tên file sẽ là `id` bài viết (ví dụ `jacobian.mdx` -> id là `jacobian`)
- Các trường `primitiveRefs`, `researchRefs`, `connections` phải tham chiếu đúng `id` file

## Cú pháp MDX cơ bản

MDX = Markdown + JSX component.

Bạn có thể dùng:

- Headings: `#`, `##`, `###`
- Danh sách: `-`, `1.`
- Công thức inline: `$...$`
- Công thức block: `$$...$$`
- Component JSX: `<Callout>...</Callout>`

## Frontmatter bắt buộc theo từng collection

### 1) Primitive (`src/content/primitives/*.mdx`)

```mdx
---
title: Jacobian matrix
symbol: J
group: geometry
summary: Ma tran dao ham rieng mo ta anh xa tuyen tinh cuc bo.
connections:
  - gradient
  - hessian
aiHooks:
  - backprop
  - diffusion
draft: false
publishedAt: 2026-04-02
---
```

`group` chỉ nhận một trong các giá trị:

- `foundation`
- `physics`
- `geometry`
- `theory`

### 2) Research (`src/content/research/*.mdx`)

```mdx
---
title: Diffusion models (note)
paperUrl: https://arxiv.org/abs/2006.11239
primitiveRefs:
  - jacobian
  - entropy
trend: diffusion
draft: false
publishedAt: 2026-04-02
---
```

### 3) Linking (`src/content/linking/*.mdx`)

```mdx
---
title: Jacobian, KL và diffusion
primitiveRefs:
  - jacobian
  - kl-divergence
researchRefs:
  - diffusion-models
draft: false
publishedAt: 2026-04-02
---
```

## Component dùng trong bài MDX

Project đã bật sẵn các component, bạn có thể dùng trực tiếp trong `.mdx`:

- `<Callout type="insight|warning|note">...</Callout>`
- `<Math label="...">...</Math>`
- `<Intuition>...</Intuition>`
- `<AIHook href="/research/...">...</AIHook>`
- `<PrimitiveRef slug="...">...</PrimitiveRef>`

Ví dụ:

```mdx
<Callout type="insight">
Jacobian là xấp xỉ tuyến tính tốt nhất của hàm vector tại một điểm.
</Callout>

<Intuition>
Hãy tưởng tượng ánh xạ phi tuyến như cao su bị kéo dãn theo từng hướng.
</Intuition>

<AIHook href="/research/diffusion-models">Diffusion models</AIHook>

<PrimitiveRef slug="entropy" />
```

## Viết công thức toán (KaTeX)

Inline math:

```md
Entropy: $H(X) = -\sum_x p(x)\log p(x)$
```

Block math:

```md
$$
J_f(x) = \left(\frac{\partial f_i}{\partial x_j}\right)
$$
```

Lưu ý thực tế:

- Nếu công thức quá phức tạp trong MDX, ưu tiên viết gọn để tránh lỗi parser.
- Tăng độ ổn định bằng cách tách công thức dài thành nhiều block ngắn.

## Template đầy đủ cho một bài primitive

```mdx
---
title: Ten primitive
symbol: T
group: foundation
summary: Mot cau mo ta ngan gon, ro y.
connections:
  - primitive-khac-1
  - primitive-khac-2
aiHooks:
  - diffusion
  - backprop
draft: false
publishedAt: 2026-04-02
---

## 1. Tại sao tồn tại

Mô tả bài toán gốc mà primitive này giải quyết.

## 2. Trực giác

<Intuition>
Diễn giải bằng hình ảnh hoặc ví dụ đời thường.
</Intuition>

## 3. Công thức tối thiểu

$$
\text{viet-cong-thuc-o-day}
$$

## 4. Ví dụ tính tay

Đưa ví dụ số cụ thể.

## 5. Liên hệ AI

- Ý 1
- Ý 2

<AIHook href="/research/ten-research-post">Tên research liên quan</AIHook>

## 6. Câu hỏi mở

1. Câu hỏi 1
2. Câu hỏi 2
```

## Quy tắc xuất bản

- `draft: true` -> không hiển thị khi build production
- `draft: false` hoặc bỏ trống (mặc định false) -> hiển thị bình thường

## Chạy local

```bash
npm install
npm run dev
```

## Build production

```bash
npm run build
```

## Build và deploy lên GitHub Pages

Project đã có workflow tại `.github/workflows/deploy.yml`.

Làm theo các bước sau:

1. Tạo repo trên GitHub (ví dụ: `math-ai-connect`).
2. Push code lên nhánh `main`.
3. Vào GitHub: `Settings` -> `Pages`.
4. Ở mục `Build and deployment`, chọn `Source = GitHub Actions`.
5. Đảm bảo file `astro.config.mjs` có `site` và `base` đúng theo repo:
   - `site`: `https://<username>.github.io`
   - `base`: `/<repo-name>`
6. Mỗi lần push `main`, workflow sẽ tự build và deploy.
7. Xem kết quả tại tab `Actions` và link Pages sau khi job `deploy` thành công.

## Checklist nhanh trước khi push

- Có ít nhất 1 bài trong collection bạn muốn hiển thị
- Không sai chính tả `id` khi tham chiếu chéo
- `npm run build` chạy xanh tại máy local
- Đã bật `GitHub Actions` trong GitHub Pages settings
