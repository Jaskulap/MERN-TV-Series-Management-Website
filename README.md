# rep

1. Wprowadzenie
Aplikacja ta służy do śledzenia i organizacji seriali, umożliwiając użytkownikom dodawanie seriali, zaznaczanie obejrzanych odcinków, śledzenie statystyk oraz zamieszczanie komentarzy, które mogą być odczytywane przez innych użytkowników.

2. Architektura i podział aplikacji
	Aplikacja oparta na stacku MERN (Mongo, Express, React i Node) składa się z dwóch głównych komponentów: frontendu i backendu. Frontend, stworzony przy użyciu Reacta, odpowiada za prezentację danych i interakcję z użytkownikiem. Backend, oparty na Expressie, zarządza logiką aplikacji.
Komunikacja między frontendem a backendem odbywa się za pomocą REST API, które umożliwia przesyłanie żądań i odbieranie odpowiedzi. Backend komunikuje się z bazą danych MongoDB, która jest nierelacyjną bazą danych typu dokumentowego. Wykorzystanie MongoDB pozwala na przechowywanie danych o serialach, obejrzanych odcinkach oraz dodanych komentarzach.

 
3. Funkcjonalności i zrzuty ekranu
Rejestracja z walidacją danych
![obraz](https://github.com/Jaskulap/MERN-TV-Series-Management-Website/assets/134634923/56c9bc85-138e-4980-b712-a8ee38315503)


Logowanie
![obraz](https://github.com/Jaskulap/MERN-TV-Series-Management-Website/assets/134634923/d5afdce8-8620-4088-84f7-47d4d436bff7)

 
Rozwijane Menu boczne
![obraz](https://github.com/Jaskulap/MERN-TV-Series-Management-Website/assets/134634923/8c52d88a-9bb9-4462-a8fd-c3ec3c93c273)


Strona główna, widoczne listy z serialami podzielone na kategorie, Użytkownik ma możliwość dodania lub usunięcia serialu przyciskiem w prawym górnym rogu panelu. Może też wejść do konkretnego serialu klikając na jego panel.
![obraz](https://github.com/Jaskulap/MERN-TV-Series-Management-Website/assets/134634923/3afcaaf5-21fb-405d-a98d-701cf4700e84)

Widok serialu, Użytkownik ma możliwość dodania lub usunięcia serialu, a także schowania panelu z informacjami, w celu obejrzenia tła. Po dodaniu serialu, ujawniają się przyciski do oznaczenia obejrzanych odcinków, oraz licznik
![obraz](https://github.com/Jaskulap/MERN-TV-Series-Management-Website/assets/134634923/fd565f1f-f466-4a74-8829-97c0ea3ffded)
![obraz](https://github.com/Jaskulap/MERN-TV-Series-Management-Website/assets/134634923/24ea4b73-2650-43a9-8754-59a989ed8809)

 

Widok profilu przedstawia listę dodanych seriali, oraz dane Użytkownika 
![obraz](https://github.com/Jaskulap/MERN-TV-Series-Management-Website/assets/134634923/7cb76cb2-d410-4a54-b553-994a0faa9ac1)

Widok statystyk
![obraz](https://github.com/Jaskulap/MERN-TV-Series-Management-Website/assets/134634923/2d90a813-3778-442b-8dc9-64c920af1ffc)

 
Widok społeczności, Użytkownik ma możliwość czytania komentarzy innych Użytkowników, dodawania własnych, oraz usuwania swoich komentarzy. 
![obraz](https://github.com/Jaskulap/MERN-TV-Series-Management-Website/assets/134634923/611f6fad-98d5-4986-b2c0-2cacf4833b7b)
![obraz](https://github.com/Jaskulap/MERN-TV-Series-Management-Website/assets/134634923/a04aaffd-dc2b-4fa7-a690-ff369ee5f4e1)


Oczywiście możliwe jest także wylogowanie się z konta, oraz usunięcie go. Większość działań zabezpieczona jest weryfikacją tokena, trzymanego w local storage. Wszelkie operacje zapisywane są w bazie danych, po ponownym wejściu na konto, informacje pozostaną odczytane bez zmian.
 
Strona jest również responsywna, interfejs działa poprawnie nawet przy niewielkich rozmiarach okna przeglądarki.
![obraz](https://github.com/Jaskulap/MERN-TV-Series-Management-Website/assets/134634923/740f6dae-69f5-4a87-8da7-9ccedd55934b)
![obraz](https://github.com/Jaskulap/MERN-TV-Series-Management-Website/assets/134634923/f5874914-9c31-4ff6-9533-c50d3a873936)


