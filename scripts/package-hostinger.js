Promise.all([
  import('node:fs'),
  import('node:path'),
  import('node:child_process'),
]).then(([fsModule, pathModule, childProcess]) => {
const fs = fsModule.default
const path = pathModule.default
const { execSync } = childProcess

const rootDir = path.resolve(__dirname, '..')
const standaloneDir = path.join(rootDir, '.next', 'standalone')
const publicDir = path.join(rootDir, 'public')
const staticDir = path.join(rootDir, '.next', 'static')
const deployDir = path.join(rootDir, 'hostinger-deploy')

console.log('🚀 Preparing Hostinger Node.js Deployment Package...')

// 1. Create clean deployDir
if (fs.existsSync(deployDir)) {
  fs.rmSync(deployDir, { recursive: true, force: true })
}
fs.mkdirSync(deployDir, { recursive: true })

// 2. Copy standalone files
console.log('📦 Copying standalone server & dependencies...')
fs.cpSync(standaloneDir, deployDir, { recursive: true })

// 3. Copy public to deployDir/public
console.log('🖼️ Copying public assets...')
const targetPublic = path.join(deployDir, 'public')
fs.cpSync(publicDir, targetPublic, { recursive: true })

// 4. Copy .next/static to deployDir/.next/static
console.log('⚡ Copying .next/static optimized bundles...')
const targetStatic = path.join(deployDir, '.next', 'static')
fs.cpSync(staticDir, targetStatic, { recursive: true })

// 5. Create ecosystem.config.js for PM2 (Hostinger VPS / Node.js manager)
const pm2Config = `module.exports = {
  apps: [
    {
      name: 'mne-portfolio',
      script: 'server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 3000,
        HOSTNAME: '0.0.0.0'
      }
    }
  ]
};
`
fs.writeFileSync(path.join(deployDir, 'ecosystem.config.js'), pm2Config, 'utf-8')

// 6. Create .env.production without hardcoding PORT so Hostinger dynamic PORT is used
const envProd = `NODE_ENV=production
HOSTNAME=0.0.0.0
`
fs.writeFileSync(path.join(deployDir, '.env.production'), envProd, 'utf-8')

// Create index.js entry point
fs.writeFileSync(path.join(deployDir, 'index.js'), "// Hostinger Entry Point\nrequire('./server.js');\n", 'utf-8')

// Patch server.js to use dynamic Hostinger port, clean paths, and log listening status
const serverJsPath = path.join(deployDir, 'server.js')
if (fs.existsSync(serverJsPath)) {
  let serverCode = fs.readFileSync(serverJsPath, 'utf-8')
  // Clean hardcoded Windows root paths
  serverCode = serverCode.replace(/C:\\\\Users\\\\Mohamed Nagy\\\\OneDrive - Arab Open University - AOU\\\\Desktop\\\\New folder\\\\mne-portfolio/g, '.')
  // Add console.log on startup
  serverCode = serverCode.replace(
    /startServer\(\{[\s\S]*?\}\)\.catch/,
    (match) => match.replace('.catch', '.then(() => console.log("> Server running on port " + currentPort)).catch')
  )
  fs.writeFileSync(serverJsPath, serverCode, 'utf-8')
}

// 7. Write production runner package.json for Hostinger
const deployPkg = {
  name: "mne-portfolio",
  version: "0.1.0",
  private: true,
  main: "server.js",
  scripts: {
    build: "echo 'Pre-compiled ready'",
    start: "node server.js"
  }
}
fs.writeFileSync(path.join(deployDir, 'package.json'), JSON.stringify(deployPkg, null, 2), 'utf-8')

// 7. Create .htaccess for Hostinger reverse proxy if needed
const htaccess = `# Hostinger Node.js Reverse Proxy Configuration
RewriteEngine On
RewriteRule ^$ http://127.0.0.1:3000/ [P,L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P,L]
`
fs.writeFileSync(path.join(deployDir, '.htaccess'), htaccess, 'utf-8')

console.log('✅ Hostinger Deployment folder prepared at:', deployDir)

// 8. Create a ZIP archive for 1-click upload
try {
  console.log('🗜️ Creating hostinger-deploy.zip archive...')
  const zipPath = path.join(rootDir, 'hostinger-deploy.zip')
  if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath)
  }
  execSync(`powershell -Command "Get-ChildItem -Path '${deployDir}' -Force | Compress-Archive -DestinationPath '${zipPath}' -Force"`)
  console.log('🎉 ZIP Archive created successfully: hostinger-deploy.zip')
} catch (err) {
  console.warn('Could not create ZIP automatically, but deploy folder is ready:', err.message)
}
}).catch((err) => {
  console.error(err)
  process.exitCode = 1
})
