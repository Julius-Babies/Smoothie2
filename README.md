# Smoothie 2
Dieses Projekt ist ein Kassensystem, welches für einen Smoothiestand bei einem Sommerfest entwickelt wurde. Es kann allerdings auch lokal für den eigenen Betrieb aufgesetzt werden, eine Dokumentation folgt noch.

## Entwicklungshinweise

### querymaster.php
| key                            | data_passed                          | data_returns                                  |
|--------------------------------|--------------------------------------|-----------------------------------------------|
| id_viewer.get_ids              |                                      | id;status                                     |
| id_viewer.get_products         |                                      | product_name;product_price;ingredients_exists |
| customer.get_messages          | [cashpoint_id]                       | id;type;message                               |
| customer.delete_message        | [message_id]                         | /                                             |
| customer.live_orders           | [cashpoint_id]                       | name;amount;price                             |
| cuisine.get_orders             |                                      | id;create_time;status                         |
| cuisine.get_order_details      | [order_id]                           | name;amount                                   |
| cashpoint.get_products         |                                      | product_name;product_price;ingredients_exist  |
| cashpoint.update_live_order    | [cashpoint_id, product_name, amount] |                                               |
| cashpoint.order                | [cashpoint_id]                       |                                               |
| cashpoint.insert_order_details | [order_id, product_name, amount]     |                                               |
| cashpoint.insert_message       | [cashpoint_id, message_html          |                                               |
| cashpoint.clear_messages       | [cashpoint_id]                       |                                               |