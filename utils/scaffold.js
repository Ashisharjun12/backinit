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
  
  // Add empty directories if missing
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
    await fs.ensureDir(path.join(targetPath, dir));
  }
} 