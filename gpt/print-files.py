import os
import sys
from pathlib import Path
import time
import json
from datetime import datetime

# Configuration
code_directory = '../../enologic'
output_directory = 'output'
output_filename = 'print-project.txt'
state_file = os.path.join(output_directory, '.print_state.json')
batch_size = 5  # Process files in batches
max_file_size = 1024 * 1024 * 10  # 10MB max file size
read_timeout = 10  # seconds per file

# Create output directory
os.makedirs(output_directory, exist_ok=True)
output_path = os.path.join(output_directory, output_filename)

# Directories configuration
directories_to_exclude = {
    '.next',
    'gpt',
    'node_modules',
    '.git',
    '.vscode',
}

# Specific files to exclude
files_to_exclude = {
    'package-lock.json',
    # Add more files here as needed
}

directories_to_include = [
    '.'
]

extensions_to_include = [
    '.tsx',
    '.ts',
    '.js',
    '.jsx',
    '.css',
    '.json',
    '.md',
]

def print_progress(current, total, prefix='Progress'):
    bar_length = 50
    filled_length = int(bar_length * current / total)
    bar = '=' * filled_length + '-' * (bar_length - filled_length)
    percent = round(100.0 * current / total, 1)
    sys.stdout.write(f'\r{prefix}: [{bar}] {percent}% ({current}/{total})')
    sys.stdout.flush()
    if current == total:
        print()

def print_directory_structure(base_path, includable_files, output_file):
    """Print directory structure of includable files at the start of output"""
    output_file.write("Directory Structure:\n")
    output_file.write("===================\n\n")
    
    # Group files by directory
    dir_files = {}
    for file_path in includable_files:
        dir_path = os.path.dirname(file_path)
        rel_dir = os.path.relpath(dir_path, base_path)
        if rel_dir not in dir_files:
            dir_files[rel_dir] = []
        dir_files[rel_dir].append(os.path.basename(file_path))
    
    # Print directory structure
    for dir_path in sorted(dir_files.keys()):
        # Calculate directory level and indentation
        level = dir_path.count(os.sep)
        indent = '    ' * level
        
        # Print directory name
        output_file.write(f"{indent}{os.path.basename(dir_path) or '.'}/\n")
        
        # Print files in directory
        subindent = '    ' * (level + 1)
        for filename in sorted(dir_files[dir_path]):
            output_file.write(f"{subindent}{filename}\n")
    
    output_file.write("\n" + "=" * 50 + "\n\n")
    output_file.flush()

class FileProcessor:
    def __init__(self):
        self.processed_files = self.load_state()
        self.error_log = []
        self.current_batch = []
        
    def load_state(self):
        if os.path.exists(state_file):
            try:
                with open(state_file, 'r') as f:
                    return set(json.load(f)['processed_files'])
            except:
                return set()
        return set()
    
    def save_state(self):
        try:
            with open(state_file, 'w') as f:
                json.dump({'processed_files': list(self.processed_files)}, f)
        except Exception as e:
            print(f"\nWarning: Could not save state: {e}")

    def check_file_size(self, file_path):
        try:
            size = os.path.getsize(file_path)
            if size > max_file_size:
                return False, f"File too large: {size/1024/1024:.2f}MB (max {max_file_size/1024/1024}MB)"
            return True, None
        except Exception as e:
            return False, f"Error checking file size: {e}"

    def process_batch(self, files_batch, output_file, processed_count, total_files):
        for file_path in files_batch:
            rel_path = os.path.relpath(file_path, code_directory)
            
            if rel_path in self.processed_files:
                print(f"\nSkipping (already processed): {rel_path}")
                processed_count += 1
                print_progress(processed_count, total_files)
                continue

            # Check file size
            size_ok, size_error = self.check_file_size(file_path)
            if not size_ok:
                self.error_log.append(f"Skipping {rel_path}: {size_error}")
                print(f"\nSkipping: {rel_path} - {size_error}")
                processed_count += 1
                print_progress(processed_count, total_files)
                continue

            try:
                # Read file with timeout
                start_time = time.time()
                with open(file_path, 'r', encoding='utf-8') as f:
                    code_content = f.read()
                    if time.time() - start_time > read_timeout:
                        raise TimeoutError(f"File read took longer than {read_timeout} seconds")

                # Write to output
                output_file.write(f"\nFile: {rel_path}\n")
                output_file.write("=" * (len(rel_path) + 6) + "\n\n")
                output_file.write(code_content)
                output_file.write('\n' + '=' * 50 + '\n')
                output_file.flush()

                self.processed_files.add(rel_path)
                if len(self.processed_files) % 5 == 0:  # Save state every 5 files
                    self.save_state()

            except Exception as e:
                self.error_log.append(f"Error processing {rel_path}: {str(e)}")
                print(f"\nError processing {rel_path}: {str(e)}")
            
            processed_count += 1
            print_progress(processed_count, total_files)
            time.sleep(0.1)  # Small delay between files
        
        return processed_count

def should_exclude_path(path, base_path):
    """Check if any part of the path should be excluded"""
    rel_path = os.path.relpath(path, base_path)
    path_parts = rel_path.split(os.sep)
    return any(exclude in path_parts for exclude in directories_to_exclude)

def get_includable_files():
    includable_files = []
    base_path = Path(code_directory).resolve()
    
    print("\nScanning directories...")
    print(f"Base path: {base_path}")
    print(f"Including: {directories_to_include}")
    print(f"Excluding directories: {directories_to_exclude}")
    print(f"Excluding files: {files_to_exclude}")
    
    for root, dirs, files in os.walk(base_path):
        # Check if current directory should be excluded
        if should_exclude_path(root, base_path):
            dirs.clear()  # Clear the dirs list to prevent further traversal
            continue
            
        # Remove excluded directories to prevent traversal
        dirs[:] = [d for d in dirs if not should_exclude_path(os.path.join(root, d), base_path)]

        # Only include files if directory is included and file is not excluded
        for file in sorted(files):
            # Skip excluded files
            if file in files_to_exclude:
                continue
                
            if any(file.endswith(ext) for ext in extensions_to_include):
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, base_path)
                includable_files.append(file_path)
                print(f"Found: {rel_path}")
    
    return includable_files

def main():
    processor = FileProcessor()
    includable_files = get_includable_files()
    total_files = len(includable_files)
    
    if total_files == 0:
        print("\nNo files found in specified directories!")
        return
    
    print(f"\nFound {total_files} files to process.")
    print(f"Previously processed: {len(processor.processed_files)} files")
    print(f"Batch size: {batch_size}")
    print(f"Max file size: {max_file_size/1024/1024}MB")
    print(f"Read timeout: {read_timeout} seconds")
    
    user_input = input("\nProceed with processing? (y/n): ")
    if user_input.lower() != 'y':
        print("Operation cancelled by user")
        return

    # Process files in batches
    processed_count = 0
    with open(output_path, 'w', encoding='utf-8') as output_file:  # Changed to 'w' mode
        # First print the directory structure
        base_path = Path(code_directory).resolve()
        print_directory_structure(base_path, includable_files, output_file)
        
        print("\nProcessing files...")
        print_progress(0, total_files)
        
        for i in range(0, total_files, batch_size):
            batch = includable_files[i:i + batch_size]
            processed_count = processor.process_batch(batch, output_file, processed_count, total_files)
            processor.save_state()

    # Write error log if there were any errors
    if processor.error_log:
        error_log_path = os.path.join(output_directory, f'error_log_{datetime.now().strftime("%Y%m%d_%H%M%S")}.txt')
        with open(error_log_path, 'w', encoding='utf-8') as error_file:
            error_file.write("\n".join(processor.error_log))
        print(f"\nErrors encountered. Check {error_log_path} for details.")
    
    print(f"\nProcessing complete!")
    print(f"Processed files: {len(processor.processed_files)}/{total_files}")
    print(f"Output written to: {output_path}")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nOperation cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"\nUnexpected error: {str(e)}")
        sys.exit(1)