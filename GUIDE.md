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

## Tổng quan nhanh

- Schema collection nằm ở `src/content.config.ts`
- Component MDX global map nằm ở `src/components/mdx-components.ts`
- Định danh bài viết dùng `id` theo tên file, không có trường `slug` trong frontmatter

## Lưu ý quan trọng trước khi viết

- Trong Astro 6 content layer, định danh bài là `id` lấy từ tên file
- Ví dụ `src/content/primitives/jacobian.mdx` thì `id = jacobian`
- Các trường tham chiếu chéo phải trỏ vào `id` thật đang tồn tại

## Giải thích đầy đủ tất cả trường

### 1) Collection `primitives`

Tham chiếu: `src/content.config.ts`

- `title`
  - Kiểu: `string`
  - Bắt buộc: có
  - Ý nghĩa: tiêu đề bài primitive
- `symbol`
  - Kiểu: `string`
  - Bắt buộc: không
  - Ý nghĩa: ký hiệu ngắn, ví dụ `J`, `H`, `∇`
- `group`
  - Kiểu: `enum`
  - Bắt buộc: có
  - Giá trị hợp lệ: `foundation`, `physics`, `geometry`, `theory`
  - Ý nghĩa: nhóm primitive để phân loại ở trang grid
- `summary`
  - Kiểu: `string`
  - Bắt buộc: có
  - Ý nghĩa: mô tả 1 câu cho card/list
- `connections`
  - Kiểu: `string[]`
  - Bắt buộc: có
  - Ý nghĩa: danh sách `id` primitive liên quan
- `aiHooks`
  - Kiểu: `string[]`
  - Bắt buộc: có
  - Ý nghĩa: tag ứng dụng AI hiển thị dạng pill
- `draft`
  - Kiểu: `boolean`
  - Bắt buộc: không
  - Mặc định: `false`
  - Ý nghĩa: `true` thì bị ẩn khỏi listing/build logic xuất bản
- `publishedAt`
  - Kiểu: `date` (coerce từ string)
  - Bắt buộc: có
  - Ý nghĩa: dùng để sort theo thời gian

### 2) Collection `research`

Tham chiếu: `src/content.config.ts`

- `title`
  - Kiểu: `string`
  - Bắt buộc: có
- `paperUrl`
  - Kiểu: `string` URL
  - Bắt buộc: không
  - Ý nghĩa: link paper/source
- `primitiveRefs`
  - Kiểu: `string[]`
  - Bắt buộc: có
  - Ý nghĩa: danh sách `id` từ collection `primitives`
- `trend`
  - Kiểu: `string`
  - Bắt buộc: có
  - Ý nghĩa: nhãn xu hướng, ví dụ `diffusion`, `world-models`
- `draft`
  - Kiểu: `boolean`
  - Bắt buộc: không
  - Mặc định: `false`
- `publishedAt`
  - Kiểu: `date`
  - Bắt buộc: có

### 3) Collection `linking`

Tham chiếu: `src/content.config.ts`

- `title`
  - Kiểu: `string`
  - Bắt buộc: có
- `primitiveRefs`
  - Kiểu: `string[]`
  - Bắt buộc: có
  - Ý nghĩa: `id` primitive được nối ý
- `researchRefs`
  - Kiểu: `string[]`
  - Bắt buộc: có
  - Ý nghĩa: `id` research được nối ý
- `draft`
  - Kiểu: `boolean`
  - Bắt buộc: không
  - Mặc định: `false`
- `publishedAt`
  - Kiểu: `date`
  - Bắt buộc: có

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

### Giải thích đầy đủ component

Tham chiếu map: `src/components/mdx-components.ts`

- `Callout`
  - File: `src/components/Callout.astro`
  - Props:
    - `type?`: `insight | warning | note`
    - Mặc định: `note`
  - Công dụng: tạo khối nhấn mạnh theo ngữ cảnh
- `Math`
  - File: `src/components/Math.astro`
  - Props:
    - `label?`: `string`
  - Công dụng: bọc công thức/đoạn toán trong khung riêng
- `Intuition`
  - File: `src/components/Intuition.astro`
  - Props: không có
  - Công dụng: khối diễn giải trực giác
- `AIHook`
  - File: `src/components/AIHook.astro`
  - Props:
    - `href`: `string` (bắt buộc)
  - Công dụng: chip link tới bài AI/research liên quan
- `PrimitiveRef`
  - File: `src/components/PrimitiveRef.astro`
  - Props:
    - `slug`: `string` (bắt buộc)
  - Ghi chú: tên prop là `slug` vì tương thích cách dùng cũ, nhưng giá trị truyền vào phải là `id` của primitive

### Component nội bộ giao diện (không cần gọi trực tiếp trong MDX)

- `RefsPanel` (`src/components/RefsPanel.astro`)
  - Nhận `primitiveRefs`, `researchRefs` và render panel tham chiếu
- `RelatedPosts` (`src/components/RelatedPosts.astro`)
  - Nhận danh sách item liên quan để render chip cuối bài
- `PrimitiveCard` (`src/components/PrimitiveCard.astro`)
  - Nhận `item` từ collection `primitives` để render card ở list/grid

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
2. Push code lên nhánh `master` hoặc `main`.
3. Vào GitHub: `Settings` -> `Pages`.
4. Ở mục `Build and deployment`, chọn `Source = GitHub Actions`.
5. Đảm bảo file `astro.config.mjs` có `site` và `base` đúng theo repo:
   - `site`: `https://<username>.github.io`
   - `base`: `/<repo-name>`
6. Mỗi lần push `master` hoặc `main`, workflow sẽ tự build và deploy.
7. Xem kết quả tại tab `Actions` và link Pages sau khi job `deploy` thành công.

## Checklist nhanh trước khi push

- Có ít nhất 1 bài trong collection bạn muốn hiển thị
- Không sai chính tả `id` khi tham chiếu chéo
- `npm run build` chạy xanh tại máy local
- Đã bật `GitHub Actions` trong GitHub Pages settings
