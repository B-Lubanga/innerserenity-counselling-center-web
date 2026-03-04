// Verification script to check all required files and setup
import fs from 'fs'
import path from 'path'

const requiredFiles = [
  // App pages
  'app/page.tsx',
  'app/layout.tsx',
  'app/about/page.tsx',
  'app/services/page.tsx',
  'app/resources/page.tsx',
  'app/contact/page.tsx',
  'app/booking/page.tsx',
  'app/chat/page.tsx',
  
  // API routes
  'app/api/chat/route.ts',
  'app/api/email/send-confirmation/route.ts',
  
  // Components
  'components/navbar.tsx',
  'components/logo.tsx',
  'components/hero.tsx',
  'components/footer.tsx',
  'components/animated-scroll.tsx',
  
  // Lib files
  'lib/constants.ts',
  'lib/types.ts',
  'lib/helpers.ts',
  'lib/email.ts',
  'lib/animations.ts',
  
  // Config
  'tailwind.config.ts',
  'tsconfig.json',
  'package.json',
]

const missingFiles = []
const foundFiles = []

console.log('Verifying Inner Serenity Counselling Centre Setup...\n')

requiredFiles.forEach(file => {
  const fullPath = path.join(process.cwd(), file)
  if (fs.existsSync(fullPath)) {
    foundFiles.push(file)
    console.log(`✓ ${file}`)
  } else {
    missingFiles.push(file)
    console.log(`✗ ${file} - MISSING`)
  }
})

console.log(`\n=== Summary ===`)
console.log(`Found: ${foundFiles.length}/${requiredFiles.length}`)

if (missingFiles.length > 0) {
  console.log(`\nMissing Files (${missingFiles.length}):`)
  missingFiles.forEach(file => console.log(`  - ${file}`))
  process.exit(1)
} else {
  console.log('\n✓ All required files are present!')
  process.exit(0)
}
