import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



export async function mergePackageJson(projectPath, database) {
  const dbPkg = await fs.readJson(
    path.join(__dirname, `../templates/${database}/package.json`)
  );

  await fs.writeJson(
    path.join(projectPath, 'package.json'),
    {
      name: path.basename(projectPath),
      version: "1.0.0",
      type: "module",
      ...dbPkg
    },
    { spaces: 2 }
  );
}

export async function copyTemplate(templatePath, targetPath) {
  await fs.copy(templatePath, targetPath);
  
  const requiredDirs = [
    'src/models',
    'src/controllers', 
    'src/routes',
    'src/services',
    'src/middleware',
    'src/tests',
    'src/security',
    'src/validations',
  ];

  for (const dir of requiredDirs) {
    const fullPath = path.join(targetPath, dir);
    await fs.ensureDir(fullPath);
    
    // Add empty .gitkeep file if directory is empty
    if ((await fs.readdir(fullPath)).length === 0) {
      await fs.writeFile(path.join(fullPath, '.gitkeep'), '');
    }
  }
} 