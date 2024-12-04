import os

# Configuration
code_directory = '../../enologic'  # Directory to scan
output_directory = 'output'  # Directory to save output
output_filename = 'print-project.txt'  # Output filename

# List of directories to exclude from printing (exclude contents but include directory name)
directories_to_exclude = [
    'node_modules',
    # 'notes',
    'gpt',
    '.git',
    '.vscode',
    '.next',
]

# List of file names to print
files_to_print = [

    # ui components
    'aspect-ratio.tsx',
    'alert-dialog.tsx',
    'pagination.tsx',
    'tabs.tsx',
    'card.tsx',
    'slider.tsx',
    'popover.tsx',
    'progress.tsx',
    'toaster.tsx',
    'input-otp.tsx',
    'chart.tsx',
    'hover-card.tsx',
    'sheet.tsx',
    'scroll-area.tsx',
    'resizable.tsx',
    'label.tsx',
    'sonner.tsx',
    'navigation-menu.tsx',
    'accordion.tsx',
    'drawer.tsx',
    'tooltip.tsx',
    'alert.tsx',
    'use-toast.ts',
    'switch.tsx',
    'calendar.tsx',
    'breadcrumb.tsx',
    'radio-group.tsx',
    'command.tsx',
    'toggle-group.tsx',
    'avatar.tsx',
    'menubar.tsx',
    'dialog.tsx',
    'badge.tsx',
    'table.tsx',
    'separator.tsx',
    'button.tsx',
    'toggle.tsx',
    'toast.tsx',
    'checkbox.tsx',
    'collapsible.tsx',
    'dropdown-menu.tsx',
    'select.tsx',
    'textarea.tsx',
    'input.tsx',
    'skeleton.tsx',
    'context-menu.tsx',
    'form.tsx',
    'carousel.tsx',

    # layout components


    # hooks
    'use-mobile.tsx',
    'use-toast.ts',

    # lib
    'utils.ts',

    # pages
    'layout.tsx',
    'page.tsx',
 
    'globals.css',
    'postcss.config.mjs',
    'next.config.mjs',
    'README.md',
    'tailwind.config.ts',
    '.gitignore',
    'package.json',
    'tsconfig.json',
    '.eslintrc.json',
    'route.ts',
    'theme-script.js',
    'theme-provider.tsx',
    
]

# Ensure the output directory exists
os.makedirs(output_directory, exist_ok=True)

# Path for the output file
output_path = os.path.join(output_directory, output_filename)

# Function to print directory structure
def print_directory_structure(startpath):
    with open(output_path, 'w') as output_file:
        for root, dirs, files in os.walk(startpath, topdown=True):
            # Process directories, excluding specified ones
            dirs[:] = [d for d in dirs if d not in directories_to_exclude]

            level = root.replace(startpath, '').count(os.sep)
            indent = ' ' * 4 * level
            output_file.write(f"{indent}{os.path.basename(root)}/\n")
            
            subindent = ' ' * 4 * (level + 1)
            for f in files:
                if f in files_to_print:
                    output_file.write(f"{subindent}{f}\n")

# Function to print file contents
def print_file_contents():
    with open(output_path, 'a') as output_file:
        for root, dirs, files in os.walk(code_directory):
            # Exclude specified directories from further traversal
            dirs[:] = [d for d in dirs if d not in directories_to_exclude]

            for filename in files:
                if filename in files_to_print:
                    file_path = os.path.join(root, filename)
                    output_file.write(f"\nFile: {file_path}\n")
                    with open(file_path, 'r') as f:
                        code_content = f.read()
                    output_file.write(code_content)
                    output_file.write('\n' + '=' * 50 + '\n')

# Run the functions
print_directory_structure(code_directory)
print_file_contents()
