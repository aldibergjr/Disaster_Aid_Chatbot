# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions
from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from elasticsearch import Elasticsearch

es = Elasticsearch(
    [{'host':'search-pln-chatbot-cnbukm26ebicxiz5mfhd2mkvj4.us-east-2.es.amazonaws.com', 'port': 443,  'use_ssl': True}],
)

class ActionFindInformation(Action):
    
    def name(self) -> Text:
        return 'find_information'

    def searchInformation(search):
        query = {
            "query": {
                    "query_string": {
                        "default_field": "message",
                        "query": "" + search + ""
                    }
                }
            }
        res = es.search(index="disaster1", body=query)
        return "\n{}".format(res['hits']['hits'][0]["_source"]["message"])
    
    def run(self, 
            dispatcher: CollectingDispatcher, 
            tracker: Tracker, 
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        entities = tracker.latest_message.get('entities')

        message = ""
        for entity in entities:
            message = message + " " + entity["value"]

        
        print(message)
        result = "Here is your request: " + ActionFindInformation.searchInformation(message)



        dispatcher.utter_message(text=result)

        return []