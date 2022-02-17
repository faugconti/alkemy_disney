USE DISNEY;

insert into users values(1,"test@test.com","$2a$10$FY1MHedYdBcCYzk96hVMOOj8Lx3joBr5HlIGAQDlukVDBQukk7Shq");

insert into genres values(1,'Sci-Fi');
insert into genres values(2,'Fantasy');
insert into genres values(3,'Adventure');


insert into media values(1,"The Mandalorian",
"https://http2.mlstatic.com/D_NQ_NP_677932-MLA41610893428_052020-O.jpg",
'2019/12/11',4,'SHOW',1);

insert into media values(2,"The Book of Bobba Fett",
"https://pics.filmaffinity.com/El_libro_de_Boba_Fett_Serie_de_TV-736176382-large.jpg",
'2021/12/29',4,'SHOW',1);

insert into media values(3,"Toy Story",
"https://es.web.img3.acsta.net/pictures/14/03/17/10/20/509771.jpg",
'1996/03/14',4,'MOVIE',2);

insert into characters(id,name,image,age,weight,history)
values(1,'Bobba Fett','https://static.wikia.nocookie.net/esstarwars/images/a/a7/TBBF_Boba_Fett.png/revision/latest?cb=20211209014423',
50,93.5,'THE bounty hunter, ruler of tatooine..');

insert into characters(id,name,image,age,weight,history)
values(2,'Grogu','https://www.cinemascomics.com/wp-content/uploads/2020/07/baby-yoda-marvel-960x720.jpg?mrf-size=m',
120,10,'Last of his species..');
insert into characters(id,name,image,age,weight,history)
values(3,'Luke Skywalker','https://imagenes.20minutos.es/files/image_656_370/uploads/imagenes/2022/02/06/skywalker.jpeg',
35,75.2,'Last master of the jedis');
insert into characters 
values(4,'Din Djarin','https://static.wikia.nocookie.net/esstarwars/images/8/8a/Pascal_as_The_Mando-Advanced_Graphics.png/revision/latest?cb=20191205034457',
35,83,'This is they way');
insert into characters(id,name,image,age,weight,history)
values(5,'Buzz Lightyear','https://www.cinemascomics.com/wp-content/uploads/2020/08/buzz-lightyear-toy-Story.jpg',
1,1,'A toy cosmonaut');
insert into characters(id,name,image,age,weight,history)
values(6,'Rex','https://i.pinimg.com/originals/db/c6/73/dbc673b891671122d2562f4c0ea86881.jpg',
1,0.5,'A dinosaur!');

insert into appearances values(1,1);
insert into appearances values(1,2);
insert into appearances values(1,3);
insert into appearances values(1,4);

insert into appearances values(2,1);
insert into appearances values(2,2);
insert into appearances values(2,3);
insert into appearances values(2,4);

insert into appearances values(3,5);
insert into appearances values(3,6);

