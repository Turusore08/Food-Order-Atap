import os
import json
import shutil

def slugify(text):
    # Simple slugify: lowercase, replace spaces and backticks with hyphens
    return text.lower().replace(" ", "-").replace("`", "").replace("'", "")

def rename_and_update():
    base_path = r"d:\Kuliah\Semester 4\PWEB\TM-8-ETS\Food-Order-Atap"
    old_dir = os.path.join(base_path, "menu", "Foto Menu Compressed")
    new_dir = os.path.join(base_path, "menu", "foto-menu-optimized")
    json_path = os.path.join(base_path, "menu", "meta_data", "menu_data.json")
    css_path = os.path.join(base_path, "css", "style.css")

    if not os.path.exists(old_dir):
        print(f"Directory not found: {old_dir}")
        return

    if not os.path.exists(new_dir):
        os.makedirs(new_dir)

    mapping = {}

    for filename in os.listdir(old_dir):
        if filename.endswith(".webp"):
            old_name_no_ext = os.path.splitext(filename)[0]
            new_name_no_ext = slugify(old_name_no_ext)
            new_filename = new_name_no_ext + ".webp"
            
            shutil.copy2(os.path.join(old_dir, filename), os.path.join(new_dir, new_filename))
            
            # Map old partial path to new partial path for JSON replacement
            old_rel = f"menu/Foto Menu Compressed/{filename}"
            new_rel = f"menu/foto-menu-optimized/{new_filename}"
            mapping[old_rel] = new_rel
            print(f"Renamed: {filename} -> {new_filename}")

    # Update JSON
    if os.path.exists(json_path):
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        for category in data:
            img_path = category.get('image', '')
            if img_path in mapping:
                category['image'] = mapping[img_path]
        
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
        print("Updated JSON references.")

    # Update CSS
    if os.path.exists(css_path):
        with open(css_path, 'r', encoding='utf-8') as f:
            css_content = f.read()
        
        for old_rel, new_rel in mapping.items():
            # CSS uses ../ pathing
            old_css_rel = old_rel.replace("menu/", "../menu/")
            new_css_rel = new_rel.replace("menu/", "../menu/")
            css_content = css_content.replace(old_css_rel, new_css_rel)
            
        with open(css_path, 'w', encoding='utf-8') as f:
            f.write(css_content)
        print("Updated CSS references.")

if __name__ == "__main__":
    rename_and_update()
