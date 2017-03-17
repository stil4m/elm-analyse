module Client.Graph.Node exposing (nameToString)

import Graph.Node as Node


nameToString : Node.Name -> String
nameToString names =
    String.join "." names
