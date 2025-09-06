import json


ans=[]
with open('csvjson (6).json', 'r') as file:
    data = json.load(file)
    for entry in data:
        ans.append({
            "email": entry["email"],
            "slip_number": entry["slip_number"],
            "Year": entry["Year"],
            "Branch": entry["Branch ( eg : CSE,ECE,IT,... )"],
            "phonenumber": entry["phonenumber"],
            "name":entry["name"],
            "app_number":entry["app_num"]
        })
with open('data.json', 'w') as outfile:
    json.dump(ans, outfile, indent=4)
print("done")