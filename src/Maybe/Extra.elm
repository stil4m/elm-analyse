module Maybe.Extra exposing (filter, orElseLazy)


filter : (a -> Bool) -> Maybe a -> Maybe a
filter f =
    Maybe.andThen
        (\a ->
            if f a then
                Just a

            else
                Nothing
        )


orElseLazy : (() -> Maybe a) -> Maybe a -> Maybe a
orElseLazy fma mb =
    case mb of
        Nothing ->
            fma ()

        Just _ ->
            mb
