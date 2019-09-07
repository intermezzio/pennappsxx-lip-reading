import cgitb
cgitb.enable()
form = cgi.FieldStorage()
if "name" not in form:
    print("<H1>Error</H1>")
    print("Please fill in the upload.")
    return
print("<p>name:", form["name"].value)