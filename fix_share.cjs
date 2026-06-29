const fs = require('fs');
let content = fs.readFileSync('src/pages/user/tools/QuranFull.tsx', 'utf8');

const regex = /catch \(e\) \{\s*console\.error\("Erreur de sauvegarde Capacitor:", e\);\s*alert\("Erreur lors de la sauvegarde de l'image\."\);\s*\}/;
const replacement = `catch (e: any) {
                                      if (e && e.message !== 'Share canceled') {
                                        console.error("Erreur de sauvegarde Capacitor:", e);
                                        alert("Erreur lors de la sauvegarde de l'image.");
                                      }
                                    }`;

if (regex.test(content)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync('src/pages/user/tools/QuranFull.tsx', content);
  console.log("Successfully fixed share error in QuranFull.tsx");
} else {
  console.log("Target not found!");
}
