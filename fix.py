import re

content = open('supabase/setup_all.sql', 'r', encoding='utf-8').read()

# Remove the appended 005 and 006 migrations from setup_all.sql 
# because they conflict with the existing tables
# 005 starts at line 571
content = content.split('-- Location Voiture — Migration 005: Infractions')[0]

# Add the superadmin migration properly
superadmin_sql = open('supabase/migrations/006_superadmin.sql', 'r', encoding='utf-8').read()
content += '\n-- ============================================\n-- SUPERADMIN MIGRATION\n-- ============================================\n'
content += superadmin_sql

with open('supabase/setup_all_fixed.sql', 'w', encoding='utf-8') as f:
    f.write(content)
