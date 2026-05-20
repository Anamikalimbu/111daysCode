# Type Casting
'''Type casting is the process of converting a variable from one data type to another data type.'''
# Explicit type casting
string = "15"
number = 7

string_number = int(string)

sum = string_number + number
print("The sum of", string_number, "and", number, "is", sum)

#Implicit type casting
c = 1.9
d = 8
print(c + d)

# input() function 
'''The input() function is used to take input from the user. It always returns a string. If we want to take a number as input, we need to convert the string to an integer or a float using type casting.'''
# Example of taking a integer input
age = int(input("Enter your age: "))
print("I am", age, "years old")

# Example of taking a string input
name = input("Enter your name: ")
print("My name is", name)