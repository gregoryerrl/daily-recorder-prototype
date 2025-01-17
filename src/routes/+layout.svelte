<script>import '../app.css';
import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';</script><!-- Main layout with Flowbite setup -->


<Navbar class="text-black">
	<NavBrand href="/">
		<span class="self-center whitespace-nowrap text-xl font-semibold">Daily Recorder</span>
	</NavBrand>
	<NavHamburger  />
	<NavUl>
		<NavLi href="/">Dashboard</NavLi>
		<NavLi href="/collectors">Collectors</NavLi>
	</NavUl>
</Navbar>

<main class="container mx-auto p-4">
	<slot></slot>
</main>
