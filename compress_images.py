import os
import json
from PIL import Image

def compress_images(source_dir, target_dir, quality=70):
    if not os.path.exists(target_dir):
        os.makedirs(target_dir)
    
    compressed_count = 0
    for filename in os.listdir(source_dir):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            img_path = os.path.join(source_dir, filename)
            try:
                img = Image.open(img_path)
                
                # Convert to RGB if necessary
                if img.mode in ("RGBA", "P"):
                    img = img.convert("RGB")
                
                # Save as WebP (much smaller than PNG/JPG)
                target_filename = os.path.splitext(filename)[0] + ".webp"
                target_path = os.path.join(target_dir, target_filename)
                
                # Resize if too large (optional, but good for performance)
                # Max width 1200px
                if img.width > 1200:
                    ratio = 1200 / float(img.width)
                    new_height = int(float(img.height) * float(ratio))
                    img = img.resize((1200, new_height), Image.Resampling.LANCZOS)
                
                img.save(target_path, "WEBP", quality=quality, method=6)
                compressed_count += 1
                print(f"Compressed: {filename} -> {target_filename}")
            except Exception as e:
                print(f"Error compressing {filename}: {e}")
    return compressed_count

def update_json(json_path, old_prefix, new_prefix):
    if not os.path.exists(json_path):
        print(f"JSON file not found: {json_path}")
        return

    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    updated_count = 0
    for category in data:
        img_path = category.get('image', '')
        if old_prefix in img_path:
            # Replace prefix and extension
            new_img_path = img_path.replace(old_prefix, new_prefix)
            new_img_path = os.path.splitext(new_img_path)[0] + ".webp"
            category['image'] = new_img_path
            updated_count += 1
            
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    print(f"Updated {updated_count} entries in {json_path}")

if __name__ == "__main__":
    # Paths relative to workspace root
    base_path = r"d:\Kuliah\Semester 4\PWEB\TM-8-ETS\Food-Order-Atap"
    source = os.path.join(base_path, "menu", "Foto Menu")
    target = os.path.join(base_path, "menu", "Foto Menu Compressed")
    json_file = os.path.join(base_path, "menu", "meta_data", "menu_data.json")
    
    print("Starting image compression...")
    count = compress_images(source, target)
    print(f"Finished compressing {count} images.")
    
    print("Updating JSON references...")
    update_json(json_file, "menu/Foto Menu/", "menu/Foto Menu Compressed/")
    print("Done.")
