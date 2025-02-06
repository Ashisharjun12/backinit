export async function mergePackageJson(projectPath, database) {
  const basePkg = await fs.readJson(path.join(projectPath, 'package.json'));
  const dbPkg = await fs.readJson(path.join(__dirname, `../templates/${database}/package.json`));
  
  const merged = {
    ...basePkg,
    scripts: { ...basePkg.scripts, ...dbPkg.scripts },
    dependencies: { ...basePkg.dependencies, ...dbPkg.dependencies },
    devDependencies: { ...basePkg.devDependencies, ...dbPkg.devDependencies }
  };
  
  await fs.writeJson(path.join(projectPath, 'package.json'), merged, { spaces: 2 });
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