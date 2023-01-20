import {Appointment} from "./index";

export const aliceReference = "Patient/46c2cba1ea7ecb5f0c17d5c8"
export const bobReference = "Patient/46c2cba1ea7ecb5f0c17d5c9"

export const mockAppointment: any = {
    "resourceType": "Appointment",
    "id": "63967a357c2d224aef2ed0e1",
    "meta": {
        "extension": [
            {
                "url": "http://midata.coop/extensions/metadata",
                "extension": [
                    {
                        "url": "app",
                        "valueCoding": {
                            "system": "http://midata.coop/codesystems/app",
                            "code": "firecard",
                            "display": "Firecard"
                        }
                    },
                    {
                        "url": "creator",
                        "valueReference": {
                            "reference": "Patient/522246a7ea7ecb5f0c5d43ab",
                            "display": "Bob Doe"
                        }
                    },
                    {
                        "url": "modifiedBy",
                        "valueReference": {
                            "reference": "Patient/522246a7ea7ecb5f0c5d43ab",
                            "display": "Bob Doe"
                        }
                    }
                ]
            }
        ],
        "versionId": "1670807131060",
        "lastUpdated": "2022-12-12T02:05:31.060+01:00"
    },
    "status": "booked",
    "description": "Hhhh",
    "start": "2022-12-27T23:00:00.000+00:00",
    "end": "2022-12-27T23:00:00.000+00:00",
    "participant": [
        {
            "actor": {
                "reference": "Patient/46c2cba1ea7ecb5f0c17d5c9",
                "display": "Bob Doe"
            },
            "status": "tentative"
        },
        {
            "actor": {
                "reference": "Patient/46c2cba1ea7ecb5f0c17d5c8",
                "display": "Alice Doe"
            },
            "status": "tentative"
        }
    ]
}