--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: favoritos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.favoritos (
    id integer NOT NULL,
    id_usuario integer NOT NULL,
    id_peliculas integer NOT NULL,
    fecha_agregado timestamp without time zone DEFAULT now()
);


ALTER TABLE public.favoritos OWNER TO postgres;

--
-- Name: favoritos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.favoritos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.favoritos_id_seq OWNER TO postgres;

--
-- Name: favoritos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.favoritos_id_seq OWNED BY public.favoritos.id;


--
-- Name: genero; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.genero (
    id integer NOT NULL,
    titulo character varying(100) NOT NULL
);


ALTER TABLE public.genero OWNER TO postgres;

--
-- Name: genero_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.genero_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.genero_id_seq OWNER TO postgres;

--
-- Name: genero_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.genero_id_seq OWNED BY public.genero.id;


--
-- Name: peliculas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.peliculas (
    id integer NOT NULL,
    titulo character varying(100) NOT NULL,
    descripcion text,
    anio integer,
    genero_id integer,
    imagen_url character varying(255)
);


ALTER TABLE public.peliculas OWNER TO postgres;

--
-- Name: peliculas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.peliculas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.peliculas_id_seq OWNER TO postgres;

--
-- Name: peliculas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.peliculas_id_seq OWNED BY public.peliculas.id;


--
-- Name: recuperar_peliculas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recuperar_peliculas (
    id integer NOT NULL,
    titulo character varying(255) NOT NULL,
    descripcion text,
    anio integer,
    genero_id integer,
    imagen_url text,
    fecha_eliminacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.recuperar_peliculas OWNER TO postgres;

--
-- Name: recuperar_peliculas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.recuperar_peliculas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.recuperar_peliculas_id_seq OWNER TO postgres;

--
-- Name: recuperar_peliculas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.recuperar_peliculas_id_seq OWNED BY public.recuperar_peliculas.id;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    email character varying(100) NOT NULL,
    telefono character varying(15) NOT NULL,
    id_cuenta integer NOT NULL
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- Name: usuarios_id_cuenta_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_cuenta_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_cuenta_seq OWNER TO postgres;

--
-- Name: usuarios_id_cuenta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_cuenta_seq OWNED BY public.usuarios.id_cuenta;


--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- Name: favoritos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favoritos ALTER COLUMN id SET DEFAULT nextval('public.favoritos_id_seq'::regclass);


--
-- Name: genero id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genero ALTER COLUMN id SET DEFAULT nextval('public.genero_id_seq'::regclass);


--
-- Name: peliculas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.peliculas ALTER COLUMN id SET DEFAULT nextval('public.peliculas_id_seq'::regclass);


--
-- Name: recuperar_peliculas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recuperar_peliculas ALTER COLUMN id SET DEFAULT nextval('public.recuperar_peliculas_id_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- Name: usuarios id_cuenta; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id_cuenta SET DEFAULT nextval('public.usuarios_id_cuenta_seq'::regclass);


--
-- Data for Name: favoritos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.favoritos (id, id_usuario, id_peliculas, fecha_agregado) FROM stdin;
5	1	14	2025-02-08 19:57:52.274961
25	1	17	2025-02-11 10:50:14.387839
34	1	18	2025-02-13 06:59:14.384417
39	3	17	2025-02-14 07:13:41.981892
40	3	18	2025-02-14 07:13:43.999406
42	3	32	2025-02-14 07:13:53.153405
43	3	28	2025-02-14 07:14:06.984348
44	3	21	2025-02-14 07:14:22.371153
45	3	19	2025-02-14 07:14:32.071174
46	3	5	2025-02-14 07:14:35.553291
47	3	3	2025-02-14 07:14:57.705881
48	1	19	2025-02-14 08:32:09.78072
55	1	30	2025-02-14 11:46:08.981189
\.


--
-- Data for Name: genero; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.genero (id, titulo) FROM stdin;
1	Acción
2	Terror
3	Ciencia Ficción
4	Romance
5	Comedia
6	Suspense
7	Fantasía
8	Infantil
9	Aventura
10	Documental
\.


--
-- Data for Name: peliculas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.peliculas (id, titulo, descripcion, anio, genero_id, imagen_url) FROM stdin;
2	Inception	Un ladrón especializado en robar secretos a través del sueño es dado una oportunidad de redención si puede realizar un robo en el subconsciente de una persona.	2010	1	https://m.media-amazon.com/images/M/MV5BZjhkNjM0ZTMtNGM5MC00ZTQ3LTk3YmYtZTkzYzdiNWE0ZTA2XkEyXkFqcGc@._V1_.jpg
3	The Dark Knight	Batman se enfrenta al caos sembrado por el Joker, un criminal sin escrúpulos decidido a sumergir a Gotham en el caos.	2008	1	https://m.media-amazon.com/images/S/pv-target-images/e9a43e647b2ca70e75a3c0af046c4dfdcd712380889779cbdc2c57d94ab63902.jpg
5	It	Un grupo de niños enfrenta a un mal ancestral que toma la forma de un payaso aterrador.	2017	2	https://static.posters.cz/image/1300/art-photo/it-pennywise-face-i130006.jpg
6	Interstellar	Un grupo de astronautas busca un nuevo hogar para la humanidad en un viaje interestelar.	2014	3	https://musicart.xboxlive.com/7/912b1000-0000-0000-0000-000000000002/504/image.jpg
8	Titanic	Un romance trágico se desarrolla a bordo del Titanic antes de su hundimiento.	1997	4	https://pics.filmaffinity.com/Titanic-321994924-large.jpg
9	The Notebook	Una historia de amor prohibido entre dos jóvenes de diferentes clases sociales.	2004	4	https://i.ebayimg.com/images/g/Pf0AAOSwq7JUDNRv/s-l1200.jpg
10	The Hangover	Un grupo de amigos despierta después de una noche de fiesta sin recordar nada y con el novio desaparecido.	2009	5	https://musicart.xboxlive.com/7/a4035100-0000-0000-0000-000000000002/504/image.jpg
11	Superbad	Dos amigos intentan disfrutar de una última gran noche antes de ir a la universidad.	2007	5	https://m.media-amazon.com/images/M/MV5BNjk0MzdlZGEtNTRkOC00ZDRiLWJkYjAtMzUzYTRiNzk1YTViXkEyXkFqcGc@._V1_.jpg
12	Se7en	Dos detectives siguen el rastro de un asesino en serie que usa los siete pecados capitales como inspiración.	1995	6	https://s3.amazonaws.com/nightjarprod/content/uploads/sites/348/2024/12/17134808/191nKfP0ehp3uIvWqgPbFmI4lv9.jpg
14	John Wick	Un exasesino regresa al mundo del crimen en busca de venganza.	2014	1	https://m.media-amazon.com/images/M/MV5BMTU2NjA1ODgzMF5BMl5BanBnXkFtZTgwMTM2MTI4MjE@._V1_FMjpg_UX1000_.jpg
16	Die Hard	Un policía lucha solo contra un grupo de terroristas en un rascacielos.	1988	1	https://southhousephilly.com/wp-content/uploads/2019/12/die-hard.jpg
17	A Quiet Place	Una familia debe vivir en silencio para evitar a criaturas que cazan con el sonido.	2018	2	https://m.media-amazon.com/images/M/MV5BMjI0MDMzNTQ0M15BMl5BanBnXkFtZTgwMTM5NzM3NDM@._V1_.jpg
18	The Shining	Un hombre enloquece en un hotel aislado y aterroriza a su familia.	1980	2	https://m.media-amazon.com/images/M/MV5BNmM5ZThhY2ItOGRjOS00NzZiLWEwYTItNDgyMjFkOTgxMmRiXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg
19	Alien	Una tripulación espacial se enfrenta a una criatura alienígena mortal en su nave.	1979	2	https://lumiere-a.akamaihd.net/v1/images/1_preview_alienromulus_latam_1sht_048_v2_simp_cmyk_c04c_74c20d70.jpeg
21	Avatar	Un exmarine en un planeta alienígena se enfrenta a un dilema entre su deber y sus sentimientos.	2009	3	https://m.media-amazon.com/images/I/71LRjSVXCGL._AC_UF1000,1000_QL80_.jpg
22	Dune	Un joven debe aceptar su destino en un planeta desértico lleno de peligros y conspiraciones.	2021	3	https://legrandcontinent.eu/es/wp-content/uploads/sites/2/2024/03/5392835.jpg
24	La La Land	Un pianista y una actriz luchan por sus sueños en Los Ángeles mientras viven una historia de amor.	2016	4	https://pics.filmaffinity.com/La_ciudad_de_las_estrellas_La_La_Land-262021831-large.jpg
25	Love Actually	Diferentes historias de amor se entrelazan en la época navideña en Londres.	2003	4	https://musicart.xboxlive.com/7/409c3400-0000-0000-0000-000000000002/504/image.jpg
26	Step Brothers	Dos adultos inmaduros se ven obligados a convivir cuando sus padres se casan.	2008	5	https://images.tbs.com/tbs/$dyna_params/https%3A%2F%2Fi.cdn.tbs.com%2Fassets%2Fimages%2F2018%2F10%2FStep-Brothers-2048x1536.jpg
27	Dumb and Dumber	Dos amigos con poca inteligencia emprenden un viaje para devolver un maletín perdido.	1994	5	https://pics.filmaffinity.com/Dos_tontos_muy_tontos-138209855-large.jpg
28	Monty Python and the Holy Grail	Los caballeros del Rey Arturo emprenden una búsqueda absurda del Santo Grial.	1975	5	https://img-tomatazos.buscafs.com/29287/29287_800x1404.jpg
29	The Girl with the Dragon Tattoo	Un periodista y una hacker investigan la desaparición de una joven décadas atrás.	2011	6	https://m.media-amazon.com/images/M/MV5BMTczNDk4NTQ0OV5BMl5BanBnXkFtZTcwNDAxMDgxNw@@._V1_FMjpg_UX1000_.jpg
20	Blade Runner 2049	Un oficial descubre un secreto enterrado que podría cambiar la sociedad y el orden establecido.	2017	3	https://m.media-amazon.com/images/M/MV5BNzA1Njg4NzYxOV5BMl5BanBnXkFtZTgwODk5NjU3MzI@._V1_.jpg
30	Baby Driver	Un joven conductor experto en fugas es forzado a trabajar para un jefe criminal en un último golpe que pondrá a prueba su lealtad y habilidades.	2017	1	https://image.posta.com.tr/i/posta/75/0x0/6197022245d2a058acb48507.jpg
37	Toy Story	La franquicia se basa en el concepto antropomórfico de que todos los juguetes, sin conocimiento de los seres humanos, están secretamente vivos	1995	8	https://pics.filmaffinity.com/Toy_Story-626273371-large.jpg
32	Cars	El novato Rayo Mcqueen aspira a ser campeón de la copa Pistón, pero se extraviará en un pueblo perdido de la ruta 66 llamado Radiator Springs	2006	8	https://es.web.img2.acsta.net/pictures/14/05/28/11/24/435900.jpg
7	Gravity	Dos astronautas quedan a la deriva en el espacio después de un accidente en su estación.	2013	3	https://es.web.img3.acsta.net/pictures/210/470/21047029_20131007094903027.jpg
38	Los Goonies	Mikey es un chico 13 años que tiene una pandilla junto a su hermano mayor y sus amigos, Los Goonies. Un día deciden subir a jugar al desván de su casa, donde su padre guarda antigüedades y allí encuentran el mapa de un tesoro	1985	9	https://m.media-amazon.com/images/I/91lehtLi23L._AC_UF894,1000_QL80_.jpg
40	La conferencia	El 20 de enero de 1942, destacados representantes del régimen nazi alemán se reunieron en una villa de Berlín-Wannsee para una reunión que pasó a la historia como la Conferencia de Wannsee, en la que se decidió el asesinato sistemático de 11 millones de judíos	2022	10	https://www.aceprensa.com/wp-content/uploads/2022/05/la-conferencia.jpg
41	The Matrix	Un hacker descubre la verdad sobre la realidad y su rol en una guerra contra los controladores del mundo.	1999	1	https://cdn.hobbyconsolas.com/sites/navi.axelspringer.es/public/media/image/2016/11/matrix.jpg?tf=3840x
35	The Conjuring 2	Una pareja de investigadores paranormales ayuda a una familia aterrorizada por una presencia maligna.	2013	2	https://sm.ign.com/ign_latam/movie/t/the-conjur/the-conjuring-2_u15v.jpg
\.


--
-- Data for Name: recuperar_peliculas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recuperar_peliculas (id, titulo, descripcion, anio, genero_id, imagen_url, fecha_eliminacion) FROM stdin;
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, username, password, email, telefono, id_cuenta) FROM stdin;
1	ADMIN	1234	admin@sanflix.com	600123456	1
2	Arturo	1234	arturo@gmail.com	601234567	2
3	Iñigo	1234	inigo@gmail.com	602345678	3
4	Camilo	1234	camilo@gmail.com	603456789	4
6	Dani	1234	dani@gmail.com	6056789012	6
5	Mario	1234	mario@gmail.com	604567890	5
7	Fernando Alonso	1234	alo@gmail.com	605678901	7
8	DiegoG	1234	diegog@gmail.com	606789012	8
\.


--
-- Name: favoritos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.favoritos_id_seq', 55, true);


--
-- Name: genero_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.genero_id_seq', 10, true);


--
-- Name: peliculas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.peliculas_id_seq', 41, true);


--
-- Name: recuperar_peliculas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.recuperar_peliculas_id_seq', 7, true);


--
-- Name: usuarios_id_cuenta_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_cuenta_seq', 8, true);


--
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 8, true);


--
-- Name: favoritos favoritos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favoritos
    ADD CONSTRAINT favoritos_pkey PRIMARY KEY (id);


--
-- Name: genero genero_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genero
    ADD CONSTRAINT genero_pkey PRIMARY KEY (id);


--
-- Name: peliculas peliculas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.peliculas
    ADD CONSTRAINT peliculas_pkey PRIMARY KEY (id);


--
-- Name: recuperar_peliculas recuperar_peliculas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recuperar_peliculas
    ADD CONSTRAINT recuperar_peliculas_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- Name: usuarios usuarios_id_cuenta_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_id_cuenta_key UNIQUE (id_cuenta);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_username_key UNIQUE (username);


--
-- Name: favoritos favoritos_id_peliculas_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favoritos
    ADD CONSTRAINT favoritos_id_peliculas_fkey FOREIGN KEY (id_peliculas) REFERENCES public.peliculas(id) ON DELETE CASCADE;


--
-- Name: favoritos favoritos_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favoritos
    ADD CONSTRAINT favoritos_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id) ON DELETE SET NULL;


--
-- Name: peliculas peliculas_genero_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.peliculas
    ADD CONSTRAINT peliculas_genero_id_fkey FOREIGN KEY (genero_id) REFERENCES public.genero(id) ON DELETE CASCADE;


--
-- Name: recuperar_peliculas recuperar_peliculas_genero_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recuperar_peliculas
    ADD CONSTRAINT recuperar_peliculas_genero_id_fkey FOREIGN KEY (genero_id) REFERENCES public.genero(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

