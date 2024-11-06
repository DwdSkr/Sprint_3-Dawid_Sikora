import styles from './styles.module.css';
function Summary({ arr }) {
	const image = URL.createObjectURL(arr.cv[0]);
	return (
		<>
			<h1>Dane z formularza</h1>
			<div className={styles.summary}>
				<div>
					<h2>Dane osobowe:</h2>
					<p>Imię: {arr.name}</p>
					<p>Nazwisko: {arr.lastName}</p>
					<p>Email: {arr.email}</p>
					<p>Telefon: {arr.tel}</p>
				</div>
				{arr.hasExperience && (
					<div>
						<h2>Doświadczenie:</h2>
						<ul>
							{arr.experience.map((el) => (
								<li key={el}>
									Technologia: {el.tech}/ poziom: {el.experience}
								</li>
							))}
						</ul>
					</div>
				)}
				<div>
					<h2>Preferencje kursu:</h2>
					<p>Typ kursu: {arr.form}</p>
					<p className={styles.listLead}>Preferowane technologie</p>
					<ul>
						{arr.tech.map((el) => (
							<li key={el}>{el}</li>
						))}
					</ul>
				</div>
				<div>
					<h2>Curiculum vitae:</h2>
					<img src={image} alt='podane cv' />
				</div>
			</div>
		</>
	);
}
export default Summary;
