from fastapi import FastAPI
import json
app = FastAPI()

@app.get("/sum/{item1}/{item2}")
def get_item(item1: int, item2: int):
    res = item1 + item2
    with open("data_file.json", "w") as write_file:
        json.dump(res, write_file)
    return str(item1) + " + " + str(item2) + " = " + str(res)


