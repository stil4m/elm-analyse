module Analyser.Files.Json exposing (decodeDependency, deserialiseDependency, deserialiseDependencyValue, encodeDependency, serialiseDependency)

import Dict
import Elm.Dependency exposing (Dependency)
import Elm.Interface exposing (Exposed(..), Interface)
import Elm.Syntax.Infix as Infix
import Json.Decode as JD exposing (Decoder)
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
    JD.map3 Dependency
        (JD.field "name" JD.string)
        (JD.field "version" JD.string)
        (JD.field "interfaces"
            (JD.map Dict.fromList <|
                JD.list
                    (JD.map2
                        (\a b -> ( a, b ))
                        (JD.field "key" (JD.list JD.string))
                        (JD.field "value" decodeInterface)
                    )
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
                |> JE.list
                    (\( k, v ) ->
                        JE.object
                            [ ( "key", JE.list JE.string k )
                            , ( "value", encodeInterface v )
                            ]
                    )
          )
        ]


encodeInterface : Interface -> Value
encodeInterface =
    JE.list encodeExposedInterface


encodeExposedInterface : Exposed -> Value
encodeExposedInterface x =
    JE.object <|
        case x of
            Function s ->
                encodeTyped "function" (JE.string s)

            CustomType ( name, constructors ) ->
                encodeTyped "type_"
                    (JE.object
                        [ ( "name", JE.string name )
                        , ( "constructors", JE.list JE.string constructors )
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
          , JD.map2 Tuple.pair
                (JD.field "name" JD.string)
                (JD.field "constructors" (JD.list JD.string))
                |> JD.map CustomType
          )
        , ( "alias", JD.string |> JD.map Alias )
        , ( "operator", Infix.decoder |> JD.map Operator )
        ]
