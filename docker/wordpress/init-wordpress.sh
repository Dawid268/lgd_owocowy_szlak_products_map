#!/bin/bash

# WordPress Initialization Script for LGD Map Plugin

echo "🚀 Starting WordPress initialization..."

# Wait for WordPress to be ready
until curl -f http://localhost/ > /dev/null 2>&1; do
    echo "⏳ Waiting for WordPress to be ready..."
    sleep 5
done

echo "✅ WordPress is ready!"

# Install WordPress CLI if not present
if [ ! -f /usr/local/bin/wp ]; then
    echo "📦 Installing WordPress CLI..."
    curl -O https://raw.githubusercontent.com/wp-cli/wp-cli/gh-pages/phar/wp-cli.phar
    chmod +x wp-cli.phar
    mv wp-cli.phar /usr/local/bin/wp
fi

# Wait for database to be ready
echo "⏳ Waiting for database..."
until wp db check --allow-root > /dev/null 2>&1; do
    sleep 5
done

echo "✅ Database is ready!"

# Install WordPress if not already installed
if ! wp core is-installed --allow-root > /dev/null 2>&1; then
    echo "🔧 Installing WordPress..."
    wp core install \
        --url="http://localhost" \
        --title="LGD Map Demo" \
        --admin_user="admin" \
        --admin_password="admin123" \
        --admin_email="admin@example.com" \
        --allow-root
else
    echo "✅ WordPress is already installed"
fi

# Activate LGD Map plugin
echo "🔌 Activating LGD Map plugin..."
wp plugin activate lgd-map --allow-root

# Create demo page
echo "📄 Creating demo page..."
wp post create \
    --post_type="page" \
    --post_title="LGD Map Demo" \
    --post_name="lgd-demo" \
    --post_content="[lgd_map width=\"100%\" height=\"600px\"]" \
    --post_status="publish" \
    --allow-root

# Set demo page as homepage (optional)
echo "🏠 Setting demo page as homepage..."
wp option update show_on_front page --allow-root
DEMO_PAGE_ID=$(wp post list --post_type=page --name=lgd-demo --field=ID --allow-root)
wp option update page_on_front $DEMO_PAGE_ID --allow-root

# Update permalink structure
echo "🔗 Setting permalink structure..."
wp rewrite structure '/%postname%/' --allow-root
wp rewrite flush --allow-root

# Import sample data if available
if [ -f "/var/www/html/wp-content/plugins/lgd-map/assets/data.json" ]; then
    echo "📊 Plugin data will be imported automatically on first activation"
fi

echo "🎉 WordPress initialization completed!"
echo "🌐 Access your site at: http://localhost"
echo "🔐 Admin login: admin / admin123"
echo "📄 Demo page: http://localhost/lgd-demo"
