# Smoothie 2
Dieses Projekt ist ein Kassensystem, welches für einen Smoothiestand bei einem Sommerfest entwickelt wurde. Es kann allerdings auch lokal für den eigenen Betrieb aufgesetzt werden, eine Dokumentation folgt noch. Solltest du das Projekt verwenden wollen, **BENUTZE UNBEDINGT RELEASES**, da in main die neuesten Änderungen hochgeladen werden, welche teils nicht funktionieren. Ich werde dies aber irgendwann in einen seperaten dev-Branch auslagern.

## Aufsetzen
Voraussetzung ist ein funktionierender Webserver mit PHP7 und MariaDB.
1. Dieses Github-Repository auf den Server klonen
2. Einen Datenbankbenutzer anlegen, welcher folgende Rechte besitzt:
   - SELECT
   - UPDATE
   - INSERT
   - DELETE
   - CREATE
3. Aktualisiere setup.php (Zeile 4) und querymaster.php (Zeile 71) mit den neuen Zugangsdaten
4. Fülle die Tabelle products mit Produkten aus (Preise sind in ct anzugeben)
5. Fülle die Tabelle ingredients mit Zutaten aus
6. Fülle die Tabelle ingredients_assign mit der product_id und ingredient_id aus (PHPMyAdmin kann dabei sehr hilfreich sein)

## Hinweise zur Software
- Es ist aktuell nur mühselig möglich, mehr als zwei Kassen zu betreiben
- Die Software ist nicht gegen absichtliche oder versehentliche SQL-Injections geschützt
- Die Software ist nicht gegen XSS (Cross Site Scripting) geschützt

## Aussichten/Roadmap
- Einrichten eines Adminpanels mit:
  - Kassenverwaltung
  - Benutzerverwaltung
  - Statistiken
  - Produkt-/ Zutatenverwaltung
- Verbesserung der Küchenansicht
- Hinzufügen von Produktplatzierungen auf Kassenbildschirmen und großen Bildschirmen

## Entwicklungshinweise

### querymaster.php
| key                              | data_passed                             | data_returns                                                                   |
|----------------------------------|-----------------------------------------|--------------------------------------------------------------------------------|
| id_viewer.get_ids                |                                         | id;status                                                                      |
| id_viewer.get_products           |                                         | product_name_de;product_name_uk;product_price;ingredients_exists               |
| customer.get_messages            | [cashpoint_id]                          | id;type;message                                                                |
| customer.delete_message          | [message_id]                            | /                                                                              |
| customer.live_orders             | [cashpoint_id]                          | name_de;amount;price                                                           |
| cuisine.get_orders               |                                         | id;create_time;status                                                          |
| cuisine.get_order_details        | [order_id]                              | name_de;amount                                                                 |
| cuisine.update_status            | [order_id, status]                      |                                                                                |
| cashpoint.get_products           |                                         | product_name_de;product_price;ingredients_exist                                |
| cashpoint.update_live_order      | [cashpoint_id, product_name_de, amount] |                                                                                |
| cashpoint.order                  | [cashpoint_id]                          |                                                                                |
| cashpoint.insert_order_details   | [order_id, product_name_de, amount]     |                                                                                |
| cashpoint.insert_message         | [cashpoint_id, message_html             |                                                                                |
| cashpoint.clear_messages         | [cashpoint_id]                          |                                                                                |
| administration.get_product_data  |                                         | product_name_de;description;product_price;ingredient_name_de;ingredient_exists | 
| administration.change_ingredient | [ingredient_id, available]              |                                                                                |
| system.translation               | [id]                                    | de;uk                                                                          |