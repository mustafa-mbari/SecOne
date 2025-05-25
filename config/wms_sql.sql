--
-- PostgreSQL database cluster dump
--

-- Started on 2025-05-25 23:28:52

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE mustafa;
ALTER ROLE mustafa WITH NOSUPERUSER INHERIT NOCREATEROLE CREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:Ns5SU7zhtYEx6xjvDdCKFg==$yQd0NEBaI4fQCqhSANbDtQo912Dn65vBa3mtRfrGtdg=:HlerQRBIGGqpQgIj0hehsdBoiIIfpa0VWlW6dYNddKc=';
CREATE ROLE postgres;
ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:Dj5UWVdwk/yKaXkANZ346w==$oQBRseEyk+Ngz5vkAJB8k0j65faLr1nxBHCOETVQFWE=:DbN0liyvPTsils1W5OrC1h6LqPYe0MvZMxlI3+N2gTY=';
CREATE ROLE wms_db;
ALTER ROLE wms_db WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:PCWXWjFtc3haqqpd/aGMrg==$GigXUhL9Ioa75wxq11avdhn048fPNb5RR1/SiZ9Wd00=:QiYZupJ5N8BdX+yMmdQyXQCA4MGtvQmi2+u3x8tM8yM=';
CREATE ROLE wms_role;
ALTER ROLE wms_role WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:wdyOklMzDCbJVYbhI1nBqw==$kf9+QK/oGDYmhmH9w8EvJF2d8O1oOdBcXOmDO2Ge1Zo=:dmx0174BqsRTeoDpuU3FgJvoJ4nUfcE5Oqp6fGF4RrU=';

--
-- User Configurations
--








--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8
-- Dumped by pg_dump version 16.8

-- Started on 2025-05-25 23:28:52

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

-- Completed on 2025-05-25 23:28:52

--
-- PostgreSQL database dump complete
--

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8
-- Dumped by pg_dump version 16.8

-- Started on 2025-05-25 23:28:53

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

--
-- TOC entry 2 (class 3079 OID 16384)
-- Name: adminpack; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS adminpack WITH SCHEMA pg_catalog;


--
-- TOC entry 4938 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION adminpack; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION adminpack IS 'administrative functions for PostgreSQL';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 16561)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    role_id integer NOT NULL,
    role_name character varying(30) NOT NULL,
    description text,
    level integer DEFAULT 0,
    is_active boolean DEFAULT true,
    is_system_role boolean DEFAULT false,
    created_by integer,
    updated_by integer,
    deleted_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp without time zone
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16560)
-- Name: roles_role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.roles ALTER COLUMN role_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.roles_role_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 221 (class 1259 OID 16591)
-- Name: user_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_roles (
    user_role_id integer NOT NULL,
    user_id integer NOT NULL,
    role_id integer NOT NULL,
    is_active boolean DEFAULT true,
    expiry_date timestamp without time zone,
    assigned_by integer,
    created_by integer,
    updated_by integer,
    deleted_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp without time zone,
    notes text
);


ALTER TABLE public.user_roles OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16590)
-- Name: user_roles_user_role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.user_roles ALTER COLUMN user_role_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.user_roles_user_role_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 217 (class 1259 OID 16528)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying(50) NOT NULL,
    password_hash character varying(255) NOT NULL,
    email character varying(50) NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(30) NOT NULL,
    phone character varying(20),
    birth_date date,
    gender character varying(10),
    profile_picture character varying(255),
    address text,
    city character varying(20),
    country character varying(20),
    postal_code character varying(10),
    language_preference character varying(10),
    timezone character varying(10),
    default_warehouse_id integer,
    is_active boolean DEFAULT true,
    failed_login_attempts integer DEFAULT 0,
    account_locked boolean DEFAULT false,
    two_factor_auth_enabled boolean DEFAULT false,
    password_changed_at timestamp without time zone,
    created_by integer,
    updated_by integer,
    deleted_by integer,
    last_login timestamp without time zone,
    last_ip_address character varying(45),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp without time zone,
    notes text
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16527)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.users ALTER COLUMN user_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 4930 (class 0 OID 16561)
-- Dependencies: 219
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (role_id, role_name, description, level, is_active, is_system_role, created_by, updated_by, deleted_by, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 4932 (class 0 OID 16591)
-- Dependencies: 221
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_roles (user_role_id, user_id, role_id, is_active, expiry_date, assigned_by, created_by, updated_by, deleted_by, created_at, updated_at, deleted_at, notes) FROM stdin;
\.


--
-- TOC entry 4928 (class 0 OID 16528)
-- Dependencies: 217
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, username, password_hash, email, first_name, last_name, phone, birth_date, gender, profile_picture, address, city, country, postal_code, language_preference, timezone, default_warehouse_id, is_active, failed_login_attempts, account_locked, two_factor_auth_enabled, password_changed_at, created_by, updated_by, deleted_by, last_login, last_ip_address, created_at, updated_at, deleted_at, notes) FROM stdin;
\.


--
-- TOC entry 4939 (class 0 OID 0)
-- Dependencies: 218
-- Name: roles_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_role_id_seq', 1, false);


--
-- TOC entry 4940 (class 0 OID 0)
-- Dependencies: 220
-- Name: user_roles_user_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_roles_user_role_id_seq', 1, false);


--
-- TOC entry 4941 (class 0 OID 0)
-- Dependencies: 216
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 1, false);


--
-- TOC entry 4767 (class 2606 OID 16572)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (role_id);


--
-- TOC entry 4769 (class 2606 OID 16574)
-- Name: roles roles_role_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_role_name_key UNIQUE (role_name);


--
-- TOC entry 4771 (class 2606 OID 16600)
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (user_role_id);


--
-- TOC entry 4761 (class 2606 OID 16544)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4763 (class 2606 OID 16540)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4765 (class 2606 OID 16542)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4775 (class 2606 OID 16575)
-- Name: roles roles_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(user_id);


--
-- TOC entry 4776 (class 2606 OID 16585)
-- Name: roles roles_deleted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES public.users(user_id);


--
-- TOC entry 4777 (class 2606 OID 16580)
-- Name: roles roles_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(user_id);


--
-- TOC entry 4778 (class 2606 OID 16601)
-- Name: user_roles user_roles_assigned_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_assigned_by_fkey FOREIGN KEY (assigned_by) REFERENCES public.users(user_id);


--
-- TOC entry 4779 (class 2606 OID 16606)
-- Name: user_roles user_roles_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(user_id);


--
-- TOC entry 4780 (class 2606 OID 16616)
-- Name: user_roles user_roles_deleted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES public.users(user_id);


--
-- TOC entry 4781 (class 2606 OID 16626)
-- Name: user_roles user_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(role_id);


--
-- TOC entry 4782 (class 2606 OID 16611)
-- Name: user_roles user_roles_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(user_id);


--
-- TOC entry 4783 (class 2606 OID 16621)
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- TOC entry 4772 (class 2606 OID 16545)
-- Name: users users_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(user_id);


--
-- TOC entry 4773 (class 2606 OID 16555)
-- Name: users users_deleted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES public.users(user_id);


--
-- TOC entry 4774 (class 2606 OID 16550)
-- Name: users users_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(user_id);


-- Completed on 2025-05-25 23:28:53

--
-- PostgreSQL database dump complete
--

--
-- Database "wms_db" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8
-- Dumped by pg_dump version 16.8

-- Started on 2025-05-25 23:28:53

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

--
-- TOC entry 4938 (class 1262 OID 16631)
-- Name: wms_db; Type: DATABASE; Schema: -; Owner: mustafa
--

CREATE DATABASE wms_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'German_Germany.1252';


ALTER DATABASE wms_db OWNER TO mustafa;

\connect wms_db

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
-- TOC entry 218 (class 1259 OID 16770)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    role_id integer NOT NULL,
    role_name character varying(30) NOT NULL,
    description text,
    level integer DEFAULT 0,
    is_active boolean DEFAULT true,
    is_system_role boolean DEFAULT false,
    created_by integer,
    updated_by integer,
    deleted_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp without time zone
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16769)
-- Name: roles_role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.roles ALTER COLUMN role_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.roles_role_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 220 (class 1259 OID 16800)
-- Name: user_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_roles (
    user_role_id integer NOT NULL,
    user_id integer NOT NULL,
    role_id integer NOT NULL,
    is_active boolean DEFAULT true,
    expiry_date timestamp without time zone,
    assigned_by integer,
    created_by integer,
    updated_by integer,
    deleted_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp without time zone,
    notes text
);


ALTER TABLE public.user_roles OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16799)
-- Name: user_roles_user_role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.user_roles ALTER COLUMN user_role_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.user_roles_user_role_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 216 (class 1259 OID 16737)
-- Name: users; Type: TABLE; Schema: public; Owner: wms_role
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying(50) NOT NULL,
    password_hash character varying(255) NOT NULL,
    email character varying(50) NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(30) NOT NULL,
    phone character varying(20),
    birth_date date,
    gender character varying(10),
    profile_picture character varying(255),
    address text,
    city character varying(20),
    country character varying(20),
    postal_code character varying(10),
    language_preference character varying(10),
    timezone character varying(10),
    default_warehouse_id integer,
    is_active boolean DEFAULT true,
    failed_login_attempts integer DEFAULT 0,
    account_locked boolean DEFAULT false,
    two_factor_auth_enabled boolean DEFAULT false,
    password_changed_at timestamp without time zone,
    created_by integer,
    updated_by integer,
    deleted_by integer,
    last_login timestamp without time zone,
    last_ip_address character varying(45),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp without time zone,
    notes text,
    verification_token character varying(255),
    email_verified boolean DEFAULT false
);


ALTER TABLE public.users OWNER TO wms_role;

--
-- TOC entry 215 (class 1259 OID 16736)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: wms_role
--

ALTER TABLE public.users ALTER COLUMN user_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.users_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 4930 (class 0 OID 16770)
-- Dependencies: 218
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (role_id, role_name, description, level, is_active, is_system_role, created_by, updated_by, deleted_by, created_at, updated_at, deleted_at) FROM stdin;
2	Manager	Can put, update and delete users.	1	t	t	3	\N	\N	\N	\N	\N
1	Worker	Can show some data.	4	t	f	3	\N	\N	\N	2025-05-20 16:23:37.267471	\N
3	Manager2	Can put, update and delete users.	1	t	t	3	\N	\N	\N	\N	\N
25	Managger2	Can put, update and delete users.	1	t	t	3	\N	\N	\N	\N	2025-05-25 20:38:19.863636
26	JustTest	Nothing.	4	t	f	3	\N	\N	\N	\N	2025-05-25 20:38:27.192395
\.


--
-- TOC entry 4932 (class 0 OID 16800)
-- Dependencies: 220
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_roles (user_role_id, user_id, role_id, is_active, expiry_date, assigned_by, created_by, updated_by, deleted_by, created_at, updated_at, deleted_at, notes) FROM stdin;
1	3	2	t	\N	3	3	\N	\N	2025-05-22 15:45:30.172761	2025-05-22 15:45:30.172761	\N	Hello
2	4	1	t	\N	\N	\N	\N	\N	\N	\N	\N	\N
7	5	3	t	2025-12-31 00:00:00	3	3	\N	\N	\N	\N	2025-05-25 19:13:18.987404	Temporary role assignment - worker
8	5	3	t	2025-12-31 00:00:00	3	3	\N	\N	\N	\N	2025-05-25 19:13:18.987404	Temporary role assignment - worker
9	5	3	t	2025-12-31 00:00:00	3	3	\N	\N	\N	\N	2025-05-25 19:13:18.987404	Temporary role assignment - worker
10	5	3	t	2025-12-31 00:00:00	3	3	\N	\N	\N	\N	2025-05-25 19:13:18.987404	Temporary role assignment - worker
11	5	3	t	2025-12-31 00:00:00	3	3	\N	\N	\N	\N	2025-05-25 19:13:18.987404	Temporary role assignment - worker
5	5	2	t	2025-12-31 00:00:00	3	3	\N	\N	\N	\N	2025-05-25 19:13:35.643423	Temporary role assignment - worker
6	5	2	t	2025-12-31 00:00:00	3	3	\N	\N	\N	\N	2025-05-25 19:13:35.643423	Temporary role assignment - worker
3	4	2	t	\N	\N	\N	\N	\N	\N	\N	2025-05-25 19:13:57.169055	\N
4	4	2	t	2025-12-31 00:00:00	3	3	\N	\N	\N	\N	2025-05-25 19:13:57.169055	Temporary role assignment - worker
12	5	3	t	2025-12-31 00:00:00	3	3	\N	\N	\N	\N	\N	Temporary role assignment - worker
13	5	3	t	2025-12-31 00:00:00	3	3	\N	\N	\N	\N	\N	Temporary role assignment - worker
14	5	26	t	2025-12-31 00:00:00	3	3	\N	\N	\N	\N	\N	Temporary role assignment - worker
\.


--
-- TOC entry 4928 (class 0 OID 16737)
-- Dependencies: 216
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: wms_role
--

COPY public.users (user_id, username, password_hash, email, first_name, last_name, phone, birth_date, gender, profile_picture, address, city, country, postal_code, language_preference, timezone, default_warehouse_id, is_active, failed_login_attempts, account_locked, two_factor_auth_enabled, password_changed_at, created_by, updated_by, deleted_by, last_login, last_ip_address, created_at, updated_at, deleted_at, notes, verification_token, email_verified) FROM stdin;
3	mustafa	12345678	mustafa.info@gmail.com	mustafa	mbari	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	0	f	f	\N	\N	\N	\N	\N	\N	2025-05-09 19:14:38.036917	2025-05-09 19:14:38.036917	\N	\N	\N	f
4	ali	11223344	ali.info@gmail.com	ali	mbari	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	0	f	f	\N	\N	\N	\N	\N	\N	2025-05-09 19:15:32.357385	2025-05-09 19:15:32.357385	\N	\N	\N	f
5	ahmed123	123456hashed	ahmed@example.com	Ahmed	Ali	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	0	f	f	\N	\N	\N	\N	\N	\N	2025-05-13 09:07:14.063983	2025-05-13 09:07:14.063983	\N	\N	\N	f
6	Test123	123456hashedTest1	Test123@example.com	Test	post	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	0	f	f	\N	\N	\N	\N	\N	\N	2025-05-13 09:11:01.978315	2025-05-13 09:11:01.978315	2025-05-13 11:18:04.507898	\N	\N	f
11	sdgsdg	newpasswordhash	sdgsgsdg@example.com	John	Doe	123456789	1990-01-01	Male	path_to_picture.jpg	123 New Street	New City	Country Name	12345	English	UTC+1	2	t	0	f	f	\N	3	\N	\N	\N	\N	2025-05-13 12:00:00	\N	2025-05-20 16:32:10.39241	This is a new user	\N	f
10	xxxxName	newpasswordhash	newemail@example.com	John	Doe	123456789	1990-01-01	Male	path_to_new_picture.jpg	123 New Street	New City	Country Name	12345	English	UTC+1	2	t	0	f	f	\N	3	3	\N	\N	\N	2025-05-13 12:00:00	2025-05-13 14:08:04.987139	2025-05-20 16:32:24.498633	This is a new user	\N	f
16	johnDoe1231	SecurePass123	cr7s1@example.com	manee	fpoof	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	f	f	\N	\N	\N	\N	\N	\N	2025-05-16 09:27:20.204385	2025-05-16 09:27:20.204385	2025-05-20 16:32:36.871165	\N	1235	f
15	Crestiano Ronaldo	newpasswordhash	cr7@example.com	Crestiano	Ronaldo	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	f	f	\N	\N	\N	\N	\N	\N	2025-05-16 09:21:39.976046	2025-05-16 09:21:39.976046	2025-05-25 19:11:49.062344	\N	1235	f
\.


--
-- TOC entry 4942 (class 0 OID 0)
-- Dependencies: 217
-- Name: roles_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_role_id_seq', 26, true);


--
-- TOC entry 4943 (class 0 OID 0)
-- Dependencies: 219
-- Name: user_roles_user_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_roles_user_role_id_seq', 14, true);


--
-- TOC entry 4944 (class 0 OID 0)
-- Dependencies: 215
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wms_role
--

SELECT pg_catalog.setval('public.users_user_id_seq', 18, true);


--
-- TOC entry 4767 (class 2606 OID 16781)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (role_id);


--
-- TOC entry 4769 (class 2606 OID 16783)
-- Name: roles roles_role_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_role_name_key UNIQUE (role_name);


--
-- TOC entry 4771 (class 2606 OID 16809)
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (user_role_id);


--
-- TOC entry 4761 (class 2606 OID 16753)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: wms_role
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4763 (class 2606 OID 16749)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: wms_role
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4765 (class 2606 OID 16751)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: wms_role
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4775 (class 2606 OID 16784)
-- Name: roles roles_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(user_id);


--
-- TOC entry 4776 (class 2606 OID 16794)
-- Name: roles roles_deleted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES public.users(user_id);


--
-- TOC entry 4777 (class 2606 OID 16789)
-- Name: roles roles_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(user_id);


--
-- TOC entry 4778 (class 2606 OID 16810)
-- Name: user_roles user_roles_assigned_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_assigned_by_fkey FOREIGN KEY (assigned_by) REFERENCES public.users(user_id);


--
-- TOC entry 4779 (class 2606 OID 16815)
-- Name: user_roles user_roles_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(user_id);


--
-- TOC entry 4780 (class 2606 OID 16825)
-- Name: user_roles user_roles_deleted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES public.users(user_id);


--
-- TOC entry 4781 (class 2606 OID 16835)
-- Name: user_roles user_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(role_id);


--
-- TOC entry 4782 (class 2606 OID 16820)
-- Name: user_roles user_roles_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(user_id);


--
-- TOC entry 4783 (class 2606 OID 16830)
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- TOC entry 4772 (class 2606 OID 16754)
-- Name: users users_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wms_role
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(user_id);


--
-- TOC entry 4773 (class 2606 OID 16764)
-- Name: users users_deleted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wms_role
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES public.users(user_id);


--
-- TOC entry 4774 (class 2606 OID 16759)
-- Name: users users_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wms_role
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(user_id);


--
-- TOC entry 4939 (class 0 OID 0)
-- Dependencies: 218
-- Name: TABLE roles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.roles TO mustafa;


--
-- TOC entry 4940 (class 0 OID 0)
-- Dependencies: 220
-- Name: TABLE user_roles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.user_roles TO mustafa;


--
-- TOC entry 4941 (class 0 OID 0)
-- Dependencies: 216
-- Name: TABLE users; Type: ACL; Schema: public; Owner: wms_role
--

GRANT ALL ON TABLE public.users TO wms_db;
GRANT ALL ON TABLE public.users TO mustafa;


-- Completed on 2025-05-25 23:28:53

--
-- PostgreSQL database dump complete
--

-- Completed on 2025-05-25 23:28:53

--
-- PostgreSQL database cluster dump complete
--

