#!/usr/bin/env python3
# hello.py - a tiny interactive Python starter

# Variables and printing
name = input("What's your name? ")
print(f"Hello, {name}! Welcome to Python.")

# Simple math
a = 7
b = 3
print(f"{a} + {b} = {a + b}")

# Lists and loops
colors = ['red', 'green', 'blue']
print("Here's a list of colors:")
for i, c in enumerate(colors, start=1):
    print(i, c)

# Functions
def greet(person):
    return f"Nice to meet you, {person}!"

print(greet(name))

# Conditional and input validation
age = input("How old are you? ")
try:
    age_n = int(age)
    if age_n < 18:
        print("You're a young learner — great time to start coding!")
    else:
        print("Nice — coding is useful at any age.")
except ValueError:
    print("That doesn't look like a number, but that's OK — you can try again later.")

# Small exercise: reverse a string
s = input("Type a short word and I'll reverse it: ")
print("Reversed:", s[::-1])

print('\nDone — experiment by editing this file and re-running it.')
