#!/bin/bash

echo "🐾 Holistic Vet Clinic - Appointment Reminder System Setup"
echo "=========================================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    echo "Then run this script again."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Create public directory if it doesn't exist
if [ ! -d "public" ]; then
    echo "📁 Creating public directory..."
    mkdir public
fi

# Move HTML file to public if needed
if [ -f "appointment-reminder-system.html" ]; then
    echo "📄 Moving HTML file to public directory..."
    mv appointment-reminder-system.html public/index.html
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
echo "This may take a few minutes..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Setup complete!"
    echo ""
    echo "🚀 To start the application:"
    echo "   npm start"
    echo ""
    echo "📱 Then open your browser to:"
    echo "   http://localhost:3000"
    echo ""
    echo "📖 For detailed instructions, see README.md"
else
    echo ""
    echo "❌ Installation failed!"
    echo "Please check the error messages above and try again."
    exit 1
fi
