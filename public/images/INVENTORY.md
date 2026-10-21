# Required Image Files Inventory for Vercel Deployment

For Vercel to display your photos, the image files must physically exist in this `public/images/` folder and be committed to your GitHub repository.

### Exact File List & Where They Appear:

| Filename | Where It Appears | Format |
| :--- | :--- | :--- |
| `public/images/cat.gif` | Scene 2: Birthday Cat with guitar & candles | GIF or PNG |
| `public/images/card-front.png` | Scene 3 & 5: Greeting Card front cover illustration | PNG or JPG |
| `public/images/p1-left.jpg` | Scene 4 (Page 1): Memory book left photo | JPG or PNG |
| `public/images/p1-right.jpg` | Scene 4 (Page 1): Memory book right photo | JPG or PNG |
| `public/images/p2-left.jpg` | Scene 4 (Page 2): Memory book left photo | JPG or PNG |
| `public/images/p2-right.jpg` | Scene 4 (Page 2): Memory book right photo | JPG or PNG |
| `public/images/gallery/g1.jpg` to `g20.jpg` | Scene 6: Photo Heart finale tiles (20 photos) | JPG or PNG |
| `public/music/song.mp3` | Romantic background music | MP3 audio |

### How to Add Your Photos & Deploy to Vercel:

1. Copy your personal photos into `public/images/` with the exact filenames listed above:
   - Name your Page 1 photos `p1-left.jpg` and `p1-right.jpg`.
   - Name your Page 2 photos `p2-left.jpg` and `p2-right.jpg`.
   - Place your 20 heart photos into `public/images/gallery/` named `g1.jpg`, `g2.jpg`, ... `g20.jpg`.
   - (Optional) Place `cat.gif` and `card-front.png` (built-in fallback illustrations are already provided if omitted).

2. Commit and push the files to GitHub:
   ```bash
   git add public/images/ vercel.json src/
   git commit -m "Add photo assets for Vercel deployment"
   git push origin main
   ```

3. Vercel will automatically build and deploy. All photos will now load with HTTP 200 on your live site!
