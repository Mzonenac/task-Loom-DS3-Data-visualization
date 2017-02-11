var setUpJson = {
    "anomalousMetrics": "Response Code",
    "anomalyType": "SUDDEN_DROP",
    "entities": [
        {
            "entity": "Bytes Sent",
            "type": "CONTINUOUS",
            "distribution": {
                "relativeParts": {
                    "260": {
                        "ratio": 2.5974025974025974,
                        "occurrences": 2
                    },
                    "267": {
                        "ratio": 3.896103896103896,
                        "occurrences": 3
                    },
                    "362": {
                        "ratio": 14.285714285714285,
                        "occurrences": 11
                    },
                    "1106": {
                        "ratio": 2.5974025974025974,
                        "occurrences": 2
                    },
                    "1259": {
                        "ratio": 2.5974025974025974,
                        "occurrences": 2
                    },
                    "1326": {
                        "ratio": 2.5974025974025974,
                        "occurrences": 2
                    },
                    "1455": {
                        "ratio": 2.5974025974025974,
                        "occurrences": 2
                    },
                    "1488": {
                        "ratio": 2.5974025974025974,
                        "occurrences": 2
                    },
                    "1775": {
                        "ratio": 2.5974025974025974,
                        "occurrences": 2
                    },
                    "2267": {
                        "ratio": 2.5974025974025974,
                        "occurrences": 2
                    }
                }
            }
        },
        {
            "entity": "Remote IP",
            "type": "DISCRETE",
            "distribution": {
                "relativeParts": {
                    "40.78.17.40": {
                        "ratio": 98.7012987012987,
                        "occurrences": 76
                    },
                    "216.137.42.151": {
                        "ratio": 1.2987012987012987,
                        "occurrences": 1
                    }
                }
            }
        },
        {
            "entity": "User-Agent",
            "type": "DISCRETE",
            "distribution": {
                "relativeParts": {
                    "Amazon CloudFront": {
                        "ratio": 1.2987012987012987,
                        "occurrences": 1
                    },
                    "aws-sdk-java/1.10.49 Linux/4.4.0-34-generic Java_HotSpot(TM)_64-Bit_Server_VM/25.92-b14/1.8.0_92": {
                        "ratio": 98.7012987012987,
                        "occurrences": 76
                    }
                }
            }
        },
        {
            "entity": "Total Time",
            "type": "CONTINUOUS",
            "distribution": {
                "relativeParts": {
                    "10": {
                        "ratio": 7.792207792207792,
                        "occurrences": 6
                    },
                    "11": {
                        "ratio": 6.493506493506493,
                        "occurrences": 5
                    },
                    "12": {
                        "ratio": 11.688311688311687,
                        "occurrences": 9
                    },
                    "13": {
                        "ratio": 5.194805194805195,
                        "occurrences": 4
                    },
                    "14": {
                        "ratio": 5.194805194805195,
                        "occurrences": 4
                    },
                    "15": {
                        "ratio": 5.194805194805195,
                        "occurrences": 4
                    },
                    "16": {
                        "ratio": 9.090909090909092,
                        "occurrences": 7
                    },
                    "17": {
                        "ratio": 2.5974025974025974,
                        "occurrences": 2
                    },
                    "26": {
                        "ratio": 3.896103896103896,
                        "occurrences": 3
                    },
                    "30": {
                        "ratio": 3.896103896103896,
                        "occurrences": 3
                    }
                }
            }
        },
        {
            "entity": "Request ID",
            "type": "DISCRETE",
            "distribution": {
                "relativeParts": {
                    "07260ADD4B83EA7A": {
                        "ratio": 1.2987012987012987,
                        "occurrences": 1
                    },
                    "0925B840998E7C94": {
                        "ratio": 1.2987012987012987,
                        "occurrences": 1
                    },
                    "0E0EA66800F8D627": {
                        "ratio": 1.2987012987012987,
                        "occurrences": 10
                    },
                    "0EA5C3C6CD5AD3DB": {
                        "ratio": 1.2987012987012987,
                        "occurrences": 1
                    },
                    "0EC7C355BEB683FA": {
                        "ratio": 1.2987012987012987,
                        "occurrences": 7
                    },
                    "125A447AE403943D": {
                        "ratio": 1.2987012987012987,
                        "occurrences": 1
                    },
                    "1484D662E202BDF5": {
                        "ratio": 1.2987012987012987,
                        "occurrences": 4
                    },
                    "1A57C2449D1973DF": {
                        "ratio": 1.2987012987012987,
                        "occurrences": 1
                    },
                    "1C5D1FE7E53A3913": {
                        "ratio": 1.2987012987012987,
                        "occurrences": 1
                    },
                    "1D37C28D7A19946B": {
                        "ratio": 1.2987012987012987,
                        "occurrences": 1
                    }
                }
            }
        },
        {
            "entity": "Operation",
            "type": "DISCRETE",
            "distribution": {
                "relativeParts": {
                    "REST.GET.BUCKET": {
                        "ratio": 29.87012987012987,
                        "occurrences": 23
                    },
                    "REST.GET.OBJECT": {
                        "ratio": 70.12987012987013,
                        "occurrences": 54
                    }
                }
            }
        },
        {
            "entity": "HTTP status",
            "type": "DISCRETE",
            "distribution": {
                "relativeParts": {
                    "200": {
                        "ratio": 98.7012987012987,
                        "occurrences": 76
                    },
                    "403": {
                        "ratio": 1.2987012987012987,
                        "occurrences": 1
                    }
                }
            }
        },
        {
            "entity": "SRC IP",
            "type": "DISCRETE",
            "distribution": {
                "relativeParts": {
                    "web1.us1.acme.com": {
                        "ratio": 98.7012987012987,
                        "occurrences": 76
                    },
                    "web2.us1.acme.com": {
                        "ratio": 1.2987012987012987,
                        "occurrences": 1
                    }
                }
            }
        }
    ]
};