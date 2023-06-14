
import os
from datetime import datetime

current_datetime = datetime.now()
date_str = current_datetime.strftime("%Y-%m-%d")
time_str = current_datetime.strftime("%H-%M-%S")

output_directory = "/home/pi/can_data/store_csv"

current_path = os.path.dirname(os.path.abspath(__file__))

files = os.listdir(current_path)

for file in files:
    if file.endswith(".csv"):
        original_path = os.path.join(current_path, file)

        if os.path.exists(original_path) and os.path.getsize(original_path) > 0:
            try:
                with open(original_path, 'r') as f:
                    pass
            except IOError:
                print(f"File '{file}' is still being written. Skipping.")
                continue

            # file size in MB
            file_size_mb = os.path.getsize(original_path) / (1024 * 1024)

            if file_size_mb >= 100:

                filename, ext = os.path.splitext(file)


                new_filename = f"{filename}_{date_str}_{time_str}{ext}"


                new_path = os.path.join(output_directory, new_filename)


                os.rename(original_path, new_path)

                print(f"File '{file}' saved as: {new_path}")
            else:
                print(f"File '{file}' size is not greater than 99 MB. No renaming performed.")
        else:
            print(f"File '{file}' is still being written or empty. Skipping.")

