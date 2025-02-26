PGDMP      .                }            postgres    16.3    16.6 3    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    5    postgres    DATABASE     t   CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF-8';
    DROP DATABASE postgres;
                postgres    false            �           0    0    DATABASE postgres    COMMENT     N   COMMENT ON DATABASE postgres IS 'default administrative connection database';
                   postgres    false    4348            �            1259    16556 	   favoritos    TABLE     �   CREATE TABLE public.favoritos (
    id integer NOT NULL,
    id_usuario integer NOT NULL,
    id_peliculas integer NOT NULL,
    fecha_agregado timestamp without time zone DEFAULT now()
);
    DROP TABLE public.favoritos;
       public         heap    postgres    false            �            1259    16555    favoritos_id_seq    SEQUENCE     �   CREATE SEQUENCE public.favoritos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.favoritos_id_seq;
       public          postgres    false    223            �           0    0    favoritos_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.favoritos_id_seq OWNED BY public.favoritos.id;
          public          postgres    false    222            �            1259    16468    genero    TABLE     d   CREATE TABLE public.genero (
    id integer NOT NULL,
    titulo character varying(100) NOT NULL
);
    DROP TABLE public.genero;
       public         heap    postgres    false            �            1259    16467    genero_id_seq    SEQUENCE     �   CREATE SEQUENCE public.genero_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.genero_id_seq;
       public          postgres    false    216            �           0    0    genero_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.genero_id_seq OWNED BY public.genero.id;
          public          postgres    false    215            �            1259    16475 	   peliculas    TABLE     �   CREATE TABLE public.peliculas (
    id integer NOT NULL,
    titulo character varying(100) NOT NULL,
    descripcion text,
    anio integer,
    genero_id integer,
    imagen_url character varying(255)
);
    DROP TABLE public.peliculas;
       public         heap    postgres    false            �            1259    16474    peliculas_id_seq    SEQUENCE     �   CREATE SEQUENCE public.peliculas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.peliculas_id_seq;
       public          postgres    false    218                        0    0    peliculas_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.peliculas_id_seq OWNED BY public.peliculas.id;
          public          postgres    false    217            �            1259    16579    recuperar_peliculas    TABLE       CREATE TABLE public.recuperar_peliculas (
    id integer NOT NULL,
    titulo character varying(255) NOT NULL,
    descripcion text,
    anio integer,
    genero_id integer,
    imagen_url text,
    fecha_eliminacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
 '   DROP TABLE public.recuperar_peliculas;
       public         heap    postgres    false            �            1259    16578    recuperar_peliculas_id_seq    SEQUENCE     �   CREATE SEQUENCE public.recuperar_peliculas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public.recuperar_peliculas_id_seq;
       public          postgres    false    225                       0    0    recuperar_peliculas_id_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE public.recuperar_peliculas_id_seq OWNED BY public.recuperar_peliculas.id;
          public          postgres    false    224            �            1259    16489    usuarios    TABLE       CREATE TABLE public.usuarios (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    email character varying(100) NOT NULL,
    telefono character varying(15) NOT NULL,
    id_cuenta integer NOT NULL
);
    DROP TABLE public.usuarios;
       public         heap    postgres    false            �            1259    16503    usuarios_id_cuenta_seq    SEQUENCE     �   CREATE SEQUENCE public.usuarios_id_cuenta_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.usuarios_id_cuenta_seq;
       public          postgres    false    220                       0    0    usuarios_id_cuenta_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.usuarios_id_cuenta_seq OWNED BY public.usuarios.id_cuenta;
          public          postgres    false    221            �            1259    16488    usuarios_id_seq    SEQUENCE     �   CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.usuarios_id_seq;
       public          postgres    false    220                       0    0    usuarios_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;
          public          postgres    false    219            E           2604    16559    favoritos id    DEFAULT     l   ALTER TABLE ONLY public.favoritos ALTER COLUMN id SET DEFAULT nextval('public.favoritos_id_seq'::regclass);
 ;   ALTER TABLE public.favoritos ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    223    222    223            A           2604    16471 	   genero id    DEFAULT     f   ALTER TABLE ONLY public.genero ALTER COLUMN id SET DEFAULT nextval('public.genero_id_seq'::regclass);
 8   ALTER TABLE public.genero ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    216    215    216            B           2604    16478    peliculas id    DEFAULT     l   ALTER TABLE ONLY public.peliculas ALTER COLUMN id SET DEFAULT nextval('public.peliculas_id_seq'::regclass);
 ;   ALTER TABLE public.peliculas ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    218    217    218            G           2604    16582    recuperar_peliculas id    DEFAULT     �   ALTER TABLE ONLY public.recuperar_peliculas ALTER COLUMN id SET DEFAULT nextval('public.recuperar_peliculas_id_seq'::regclass);
 E   ALTER TABLE public.recuperar_peliculas ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    224    225    225            C           2604    16492    usuarios id    DEFAULT     j   ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);
 :   ALTER TABLE public.usuarios ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    220    219    220            D           2604    16504    usuarios id_cuenta    DEFAULT     x   ALTER TABLE ONLY public.usuarios ALTER COLUMN id_cuenta SET DEFAULT nextval('public.usuarios_id_cuenta_seq'::regclass);
 A   ALTER TABLE public.usuarios ALTER COLUMN id_cuenta DROP DEFAULT;
       public          postgres    false    221    220            �          0    16556 	   favoritos 
   TABLE DATA           Q   COPY public.favoritos (id, id_usuario, id_peliculas, fecha_agregado) FROM stdin;
    public          postgres    false    223   n:       �          0    16468    genero 
   TABLE DATA           ,   COPY public.genero (id, titulo) FROM stdin;
    public          postgres    false    216   ?;       �          0    16475 	   peliculas 
   TABLE DATA           Y   COPY public.peliculas (id, titulo, descripcion, anio, genero_id, imagen_url) FROM stdin;
    public          postgres    false    218   �;       �          0    16579    recuperar_peliculas 
   TABLE DATA           v   COPY public.recuperar_peliculas (id, titulo, descripcion, anio, genero_id, imagen_url, fecha_eliminacion) FROM stdin;
    public          postgres    false    225   6I       �          0    16489    usuarios 
   TABLE DATA           V   COPY public.usuarios (id, username, password, email, telefono, id_cuenta) FROM stdin;
    public          postgres    false    220   SI                  0    0    favoritos_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.favoritos_id_seq', 55, true);
          public          postgres    false    222                       0    0    genero_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.genero_id_seq', 10, true);
          public          postgres    false    215                       0    0    peliculas_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.peliculas_id_seq', 41, true);
          public          postgres    false    217                       0    0    recuperar_peliculas_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.recuperar_peliculas_id_seq', 7, true);
          public          postgres    false    224                       0    0    usuarios_id_cuenta_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.usuarios_id_cuenta_seq', 8, true);
          public          postgres    false    221            	           0    0    usuarios_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.usuarios_id_seq', 8, true);
          public          postgres    false    219            V           2606    16562    favoritos favoritos_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.favoritos
    ADD CONSTRAINT favoritos_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.favoritos DROP CONSTRAINT favoritos_pkey;
       public            postgres    false    223            J           2606    16473    genero genero_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.genero
    ADD CONSTRAINT genero_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.genero DROP CONSTRAINT genero_pkey;
       public            postgres    false    216            L           2606    16482    peliculas peliculas_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.peliculas
    ADD CONSTRAINT peliculas_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.peliculas DROP CONSTRAINT peliculas_pkey;
       public            postgres    false    218            X           2606    16587 ,   recuperar_peliculas recuperar_peliculas_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public.recuperar_peliculas
    ADD CONSTRAINT recuperar_peliculas_pkey PRIMARY KEY (id);
 V   ALTER TABLE ONLY public.recuperar_peliculas DROP CONSTRAINT recuperar_peliculas_pkey;
       public            postgres    false    225            N           2606    16502    usuarios usuarios_email_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);
 E   ALTER TABLE ONLY public.usuarios DROP CONSTRAINT usuarios_email_key;
       public            postgres    false    220            P           2606    16506    usuarios usuarios_id_cuenta_key 
   CONSTRAINT     _   ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_id_cuenta_key UNIQUE (id_cuenta);
 I   ALTER TABLE ONLY public.usuarios DROP CONSTRAINT usuarios_id_cuenta_key;
       public            postgres    false    220            R           2606    16494    usuarios usuarios_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.usuarios DROP CONSTRAINT usuarios_pkey;
       public            postgres    false    220            T           2606    16496    usuarios usuarios_username_key 
   CONSTRAINT     ]   ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_username_key UNIQUE (username);
 H   ALTER TABLE ONLY public.usuarios DROP CONSTRAINT usuarios_username_key;
       public            postgres    false    220            Z           2606    16573 %   favoritos favoritos_id_peliculas_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.favoritos
    ADD CONSTRAINT favoritos_id_peliculas_fkey FOREIGN KEY (id_peliculas) REFERENCES public.peliculas(id) ON DELETE CASCADE;
 O   ALTER TABLE ONLY public.favoritos DROP CONSTRAINT favoritos_id_peliculas_fkey;
       public          postgres    false    218    223    4172            [           2606    16563 #   favoritos favoritos_id_usuario_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.favoritos
    ADD CONSTRAINT favoritos_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id) ON DELETE SET NULL;
 M   ALTER TABLE ONLY public.favoritos DROP CONSTRAINT favoritos_id_usuario_fkey;
       public          postgres    false    220    4178    223            Y           2606    16483 "   peliculas peliculas_genero_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.peliculas
    ADD CONSTRAINT peliculas_genero_id_fkey FOREIGN KEY (genero_id) REFERENCES public.genero(id) ON DELETE CASCADE;
 L   ALTER TABLE ONLY public.peliculas DROP CONSTRAINT peliculas_genero_id_fkey;
       public          postgres    false    218    4170    216            \           2606    16588 6   recuperar_peliculas recuperar_peliculas_genero_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.recuperar_peliculas
    ADD CONSTRAINT recuperar_peliculas_genero_id_fkey FOREIGN KEY (genero_id) REFERENCES public.genero(id) ON DELETE SET NULL;
 `   ALTER TABLE ONLY public.recuperar_peliculas DROP CONSTRAINT recuperar_peliculas_genero_id_fkey;
       public          postgres    false    4170    225    216            �   �   x�m��mC1г��߀�Y8����_G$H�|�H�>d������yI�G�N�R?$~��%��-���Vd8$�]���E 	�������2+%K	|H~ 6�
���靸Mq;a���4�]Cp�܉괐D���t�&���?��%��1�����-��^����f$������
��j���>��&}�fQM      �   x   x�-�=
�@�z�Sx1��	�UK�aa ;v����#�b��|�����-�5�������x���j���.�=�1����<�gő:����a����"p��>�Ĩ6t�R�B�X���'�      �   _  x��YMo�H�]3���7�H��%=��'�XJ�V�v0�P"KTI$��*ʖv��2�,zט��؜[E9J:��âd�t�ι����U���Y{oj�d�:�V�\7<�{�K�׾��|�3ō�>�b��G���u������nok��F*���_�י��������
����k�a�L�:�6�������Yߋ�(�"oeL��;�~�s�z�b{Y�3Y�b��$��<{�^m��I�~61���`�<�����l��Uw��l����b��>?�ټ���y�!���ޟ����uS<I�ي�Lm�֢X�3�/F/,e>+��!4�WEa@ȟ�䆫��d�D%jܧE8S�ߛ���L��0x_qU��KiV��BG���臼��m�0Up��>�c�&�,.�C>�$�2Lϲ4_�Y>��d�F��p�-�,��|���Y2c��we�N
�6��Sd^�D���#CYiI�h�od�P\�R*\ؤ��1�W/e�;��G��aFd�Fjܢ���yDIL�^��F��w�B�ޒe�'���Z|���/K�����>Uk���ά�u˷�_���0e�^�H�-e$�l[s_й�f���K>���"�����|(Ŗ���q/"������0u�ZF�L|F�+���"�T�9�L)	���T����B&!����I���*����x襏&7"���(+�\�Z��5�;��ĸ=�i������-.�������P	m�6Ǭ%Wb!,�cQ-��o[^;�r��T:x��L�EKb��==1P����DU�Vz�^���n�?zs1���WFxԚ� ���Bn�W��Daѧ��a��u�fY����R�R ���V�Fq�,g��W>k��fECp����7�nI�4L�_*�(�n[p���ѱ�* �T�T�ku���{i�8|�_�[�eaɦ��MJS�[ۇ���g��M8�����f:�ټ"�����~�ܭ��d�f7���&������(�n���֧�����E�hPY�vB�"j�74W�[�i5�!x}#cTqkP�%��$��+f����;�L;I߹����R��)�r ��mJ�rh�0I:
�0N�(�a���(��Q���됯���ھ�P�^����r;v��OrU��DF�����#�0��)��L탢Pwd�  E�����ٛx�>�^]��K�/�X��FN����lOfW�d��������B��%�̻�,���,Ev����
P��$l�P�1Gd~�Ĺ�L����%5�h<:mpZ�f�����J��c����u���B��[� g��;�nQ��m���P)-=->�E�S����t�Ϸ���(�̴0�VV�� O�w�����e}7��pr1�Og?���qL��dz19��Ȓ��
�\필� �QJ���.�臰�	]� ٹފpG�m�ÿ`�����V���ʼ��Y�����=����nve��n�~�y5+&������{�%�͊QJ�ᑴ'�𥺲4vL��G�
��e m���^�{��{e���x���.�Uޯ�	����h�(d�����h�m��y���^�y����x�E�̳j��ga�͇i���Z/�đw��#ʁ�bJ���4%�W~i�����K�v��P�*�Q�$+k�unݵ���w�����_�_^�����o^R��L�|=����E[F�5e� �h4 �O�hӑ�;���Q"% d!��R
�k�cG��v1�lvɩ�fD�6}��� w,;��`���Q2p���5��O��H@�P��٢a�k�x�������,����r�����l�	� ��5�E��w��5�g�E7����礇I��9�d��QPFIt���w�$��ihD�(����G�eˈN���i���4�~2�f��NV%'���.I�q��I��gޭ��Lav��p�$oKc�I�KeG$�\�\�Pl{fT)����Qã5�쥻3�Yݍ?�E�+�Y�6����]�����}K���ď�gy}����h��=��x�B�"7zG7z1��7R�C`�Z@A�>]@V��0j6���� 5Ŀ�����`{M�i�����&n�j�vs�]Hr�8��:�wύ$^�W����E�(ǣ�മF����wf3�C�X�;�R1Qz�V,-Pu\I7����a������5�d0[����~a)q�����=hJ���Y�����������!J���소K�J�^��5�B��Ϙ1RZ�C����+�a�F��[I��N��g:i����#�"P�h�� ��>��*�O/6)5�Wo�n������arQ<L���g1�g��ܿi������\
�a}�R�o��"���g�P�+�`��]2;Lq�\w�Z0���D�����#��S��h�.�����~��.6���M2�_�.P�[�7�a.��J�f�%H�u�_��CM��~�˦['r���K�y��P�f��lx0��WШ�#������x��b�q��0D_R��<0�Aߨ@�m0�C����8��A�p0b�"¡�w���ο�g;jNK��-���l6;�u�ݾI�Ɣldu�M-���ۛ=�<�n1�<�S(�Cb��{��C�����Y>�z�V�m(Vj77������;C�&��C%�����_�ɗ�����$�ќ&3���9QǨƆw�+���T��S��a�Z(�h��Nb c�!:.����?;��@����(V���b���"�N|Cj���މ�,�l���Ǡ3�}� ƨi2w{��wI������M�e�ڍ�9hg{̥ӭ�-��f��*��<Qt�	�>�|��8
�t�+^��}�q:�0�jodI�RbB�ڛ���A��V���J[`(�nŊn h��n��,X����Йv�(D]�{�|I�C���M��sa�
�Z��,ym�����S?<�[����e�C�Q��-0i�)��'�.k�0���@�]x	�$4o�C�x�|e�E��h�~��Ӑp�Y��R��!})�V�8��Za�ܖAq�GmW0n�R���c{����ʁ������uӭ>�}�<�{�X]kΏ���#$�mL~sU��O�n<�l6���ӆ�����g��h�c���FӑPA���u�i�3Q�����>�R��|J�c�[�z'�u�l�����;�����`7:52-����\kC)Y#	�DO<nJ�� `�U��V�k|B��Wr�������6q�i�>{ॶT�U6-4l�b��4�T������Q><I�M�g��!~l�_Z�m�����R_�ʜ&�k�� |\c|��'m,�mR��(��6IN7�U�;X��s�JbL �E���'�0���h����W�ɓ'�ٗ�      �      x������ � �      �   �   x�]�K
�0����
ķvV��8�+�$��y���mu�X��A:�!��U�67Dq�B��i�!�tF!��%�Q�jz�&��֧Q	��ZY ���ã������%Jq�������r�B���R�в 9eh���Zӓ�^��
\�IݛC%�����-p�QP����\݆�G��#J�D��#^�     