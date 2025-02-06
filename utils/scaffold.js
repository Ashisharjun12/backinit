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