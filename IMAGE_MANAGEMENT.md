# 📸 Image Management System — Automatic Version

This system is 100% automatic. You just drag and drop files.

## 📁 Where to put images

| Section | Folder Path |
| :--- | :--- |
| **Home Hero Slideshow** | `public/assets/img/home/hero/` |
| **Testimonial Avatars** | `public/assets/img/people/customers/` |
| **Tour Images** | `public/assets/img/tours/<tour-slug>/` |
| **Past Moments / Events** | `public/assets/img/events/<event-slug>/gallery/` |

---

## 👑 How to set the Cover Photo
If you want a specific photo to appear **first** in the slideshow or list:
1. Rename that file so it starts with `cover-` (example: `cover-beach-sunset.jpg`).
2. All other photos can have any name you want.

---

## 🚀 Daily Workflow

1. **Drag and Drop** your images into the folders listed above.
2. **Refresh the website.**
3. **Done.** 

There are no commands to run and no manifest files to update. The website scans your folders in real-time.

---

## 🛠️ Technical Details (For Developers)
- Uses `src/lib/server-images.ts` to scan the filesystem.
- Works inside Server Components for zero-flash loading.
- Automatically handles new subdirectories added to `public/assets/img/events/`.

---

## 🗓️ Tour & Event Folders (Step-by-Step)
The tour cards on the home page use a **strict folder-naming convention** based on their title.

### 1. The "Slug" Path
The system looks for the main image at:
`public/assets/img/tours/[slug]/cards/`

### 2. Automatic Selection (Latest Image)
You can store multiple photos in the `cards` folder. The website will **automatically display the latest photo** (based on upload/modification time).

- **Rule:** If you want to change the cover photo of a tour card, just upload a new image to its `cards` folder.
- **Rule:** If there is only one image, that image will be used regardless of its name.

### 3. How the Slug is made
The `[slug]` is a lowercase, hyphenated version of the tour title.
- **Example Title:** "Celebrity Tour March 2026"
- **Required Folder Name:** `celebrity-tour-march-2026`

### 4. Renaming Rules
If you change the **Category** or **Date** in the `src/lib/tours-data.ts` code:
1. The title on the website will change.
2. You **MUST** rename the folder in `public/assets/img/tours/` to match that exact new title.
3. If you don't rename it, the website will show a placeholder image as a warning.
