module Parser.Types exposing (..)


type State
    = State (List Int)


emptyState : State
emptyState =
    State []


currentIndent : State -> Int
currentIndent (State xs) =
    List.head xs |> Maybe.withDefault 0


popIndent : State -> State
popIndent (State s) =
    State <| List.drop 1 s


pushIndent : Int -> State -> State
pushIndent x (State s) =
    State (x :: s)


type alias DefaultModuleData =
    { moduleName : ModuleName
    , exposingList : Exposure Expose
    }


type alias EffectModuleData =
    { moduleName : ModuleName
    , exposingList : Exposure Expose
    , command : Maybe String
    , subscription : Maybe String
    }


type Module
    = NormalModule DefaultModuleData
    | PortModule DefaultModuleData
    | EffectModule EffectModuleData
    | NoModule


type alias DocumentationComment =
    String


type ModuleName
    = ModuleName (List String)


type alias TypeAlias =
    { name : String, generics : List String, typeReference : TypeReference }


type alias Type =
    { name : String
    , generics : List String
    , cases : List ValueConstructor
    }


type alias ValueConstructor =
    { name : String
    , arguments : List TypeReference
    }


type TypeArg
    = Generic String
    | Concrete TypeReference


type TypeReference
    = GenericType String
    | Typed (List String) String (List TypeArg)
    | Unit
    | Tupled (List TypeReference)
    | Record RecordDefinition
    | GenericRecord String RecordDefinition
    | Function TypeReference TypeReference


type alias RecordDefinition =
    { fields : List RecordField }


type alias RecordField =
    ( String, TypeReference )


type Exposure a
    = None
    | All
    | Explicit (List a)


type alias Import =
    { moduleName : ModuleName, moduleAlias : Maybe ModuleName, exposingList : Exposure Expose }


type alias ExposeList inner =
    Eiter ExposeAny (List inner)


type Eiter left right
    = Left left
    | Right right


type Expose
    = InfixExpose String
    | DefinitionExpose String
    | TypeExpose String (Exposure String)


type alias ExposeAny =
    ()
