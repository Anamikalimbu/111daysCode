try:
    num = int(input("Enter a number to get its multiplication table: "))
    print(f"\nMultiplication Table for {num}:")
    for i in range(1, 11):
        print(f"{num} x {i} = {num * i}")
except ValueError:
    print("Invalid input. Please enter an integer.")
