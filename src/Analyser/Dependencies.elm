module Analyser.Dependencies exposing (Version, Dependency, deserialise, serialise, encodeDependency, decodeDependency)

import Dict exposing (Dict)
import AST.Types as AST
import Interfaces.Interface as Interface
import Json.Encode as JE exposing (Value)
import Json.Decode as JD exposing (Decoder)
import Json.Decode.Extra exposing ((|:))


type alias Version =
    String


type alias Dependency =
    { name : String
    , version : Version
    , interfaces : Dict AST.ModuleName Interface.Interface
    }


deserialise : String -> Maybe Dependency
deserialise =
    JD.decodeString decodeDependency >> Result.toMaybe


serialise : Dependency -> String
serialise =
    JE.encode 2 << encodeDependency


decodeDependency : Decoder Dependency
decodeDependency =
    JD.succeed Dependency
        |: JD.field "name" JD.string
        |: JD.field "version" JD.string
        |: JD.field "interfaces"
            (JD.map Dict.fromList <|
                JD.list
                    (JD.map2
                        (,)
                        (JD.field "key" (JD.list JD.string))
                        (JD.field "value" Interface.decodeInterface)
                    )
            )


encodeDependency : Dependency -> Value
encodeDependency dep =
    JE.object
        [ ( "name", JE.string dep.name )
        , ( "version", JE.string dep.version )
        , ( "interfaces"
          , dep.interfaces
                |> Dict.toList
                |> List.map
                    (\( k, v ) ->
                        JE.object [ ( "key", JE.list <| List.map JE.string k ), ( "value", Interface.encodeInterface v ) ]
                    )
                |> JE.list
          )
        ]
