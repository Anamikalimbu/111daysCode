friends = ["Smriti", "Ragita", "Kristina", "Pema", "Karina"]
print("Original list of friends:", friends)

# Add one new friend
new_friend = "Tashi"
friends.append(new_friend)
print(f"Added {new_friend}:", friends)

# Remove one friend
removed_friend = "Pema"
if removed_friend in friends:
    friends.remove(removed_friend)
    print(f"Removed {removed_friend}:", friends)
else:
    print(f"Could not find {removed_friend} to remove.")
