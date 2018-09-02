module Analyser.Files.Json exposing (decodeDependency, deserialiseDependency, deserialiseDependencyValue, encodeDependency, serialiseDependency)

import Dict
import Elm.Dependency exposing (Dependency)
import Elm.Interface exposing (Exposed(..), Interface)
import Elm.Syntax.Infix as Infix
import Json.Decode as JD exposing (Decoder)
import Json.Decode.Extra exposing ((|:))
import Json.Encode as JE exposing (Value)
import Util.Json exposing (decodeTyped, encodeTyped)


deserialiseDependency : String -> Maybe Dependency
deserialiseDependency =
    JD.decodeString decodeDependency >> Result.toMaybe


deserialiseDependencyValue : Value -> Maybe Dependency
deserialiseDependencyValue =
    JD.decodeValue decodeDependency >> Result.toMaybe


serialiseDependency : Dependency -> String
serialiseDependency =
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
                        (\a b -> ( a, b ))
                        (JD.field "key" (JD.list JD.string))
                        (JD.field "value" decodeInterface)
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
                        JE.object [ ( "key", JE.list <| List.map JE.string k ), ( "value", encodeInterface v ) ]
                    )
                |> JE.list
          )
        ]


encodeInterface : Interface -> Value
encodeInterface =
    JE.list << List.map encodeExposedInterface


encodeExposedInterface : Exposed -> Value
encodeExposedInterface x =
    JE.object <|
        case x of
            Function s ->
                encodeTyped "function" (JE.string s)

            Type ( name, constructors ) ->
                encodeTyped "type_"
                    (JE.object
                        [ ( "name", JE.string name )
                        , ( "constructors", JE.list <| List.map JE.string constructors )
                        ]
                    )

            Alias s ->
                encodeTyped "alias" (JE.string s)

            Operator s ->
                encodeTyped "operator" (Infix.encode s)


decodeInterface : Decoder Interface
decodeInterface =
    JD.list decodeExposedInterface


decodeExposedInterface : Decoder Exposed
decodeExposedInterface =
    decodeTyped
        [ ( "function", JD.string |> JD.map Function )
        , ( "type_"
          , JD.succeed (\a b -> ( a, b ))
                |: JD.field "name" JD.string
                |: JD.field "constructors" (JD.list JD.string)
                |> JD.map Type
          )
        , ( "alias", JD.string |> JD.map Alias )
        , ( "operator", Infix.decode |> JD.map Operator )
        ]
