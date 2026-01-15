# Cách Fix Vercel Settings Bị Khóa

## Vấn Đề

Khi deploy backend project, các nút Edit bị khóa vì Vercel auto-detect framework.

## Giải Pháp

### Cách 1: Chọn Framework Preset = "Other" Trước

1. **Quan trọng**: Chọn **Framework Preset** = **Other** trước tiên
2. Sau khi chọn "Other", các nút Edit sẽ mở khóa
3. Sau đó mới sửa các settings khác:
   - Root Directory: `api`
   - Build Command: (để trống)
   - Output Directory: (để trống)
   - Install Command: `pip install -r requirements.txt`

### Cách 2: Dùng vercel.json (Đã Config Sẵn) ✅

Tôi đã thêm config vào `api/vercel.json`:

```json
{
  "buildCommand": "",
  "installCommand": "pip install -r requirements.txt",
  "outputDirectory": ""
}
```

**Vercel sẽ tự động đọc file này và override settings!**

### Cách 3: Override Settings Sau Khi Deploy

1. Deploy project với settings hiện tại (có thể sẽ fail)
2. Vào **Settings** → **General**
3. Scroll xuống phần **Build & Development Settings**
4. Click **Override** bên cạnh mỗi field
5. Sửa giá trị:
   - Build Command: (để trống)
   - Output Directory: (để trống)
   - Install Command: `pip install -r requirements.txt`
6. Click **Save**
7. **Redeploy**

## Khuyến Nghị

**Dùng Cách 2** (vercel.json) vì:
- ✅ Tự động, không cần sửa thủ công
- ✅ Đã được config sẵn trong code
- ✅ Không bị reset khi redeploy

File `api/vercel.json` đã có đầy đủ config, Vercel sẽ tự động đọc và áp dụng!

## Test

Sau khi deploy, kiểm tra:
1. Vào **Deployments** → Click vào deployment mới nhất
2. Xem **Build Logs**
3. Kiểm tra xem có chạy `pip install -r requirements.txt` không
4. Nếu có → ✅ Thành công!

