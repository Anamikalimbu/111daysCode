numbers_list = [10, 20, 30, 40, 50, 60, 70]
print("We have a list of numbers:", numbers_list)

try:
    search_num = int(input("Enter a number to search in the list: "))
    
    # Check existence
    if search_num in numbers_list:
        print(f"Yes! The number {search_num} exists in the list.")
    else:
        print(f"No. The number {search_num} does not exist in the list.")
except ValueError:
    print("Invalid input. Please enter a valid integer.")
