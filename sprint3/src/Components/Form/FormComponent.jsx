import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import Summary from '../Summary/Summary';
import styles from './styles.module.css';
const FormComponent = () => {
	const techList = ['React', 'Node.js', 'HTML', 'CSS', 'Next.js'];
	const yearList = [1, 2, 3, 4, 5];
	const [checkbox, setCheckbox] = useState(false);
	const [page, setPage] = useState(0);
	function handleCheckbox() {
		setCheckbox(!checkbox);
	}

	const formSchema = z
		.object({
			name: z
				.string()
				.min(3, { message: 'Imię musi składać sie conajmniej z 3 znaków' }),
			lastName: z
				.string()
				.min(3, { message: 'Nazwisko musi składać się conajmniej z 3 znaków' }),
			email: z.string().email('Niepoprawny adres email'),
			tel: z.string().regex(/^\+?[0-9]{9,15}$/, 'Niepoprawny numer telefonu'),
			form: z.enum(['Stacjonarna', 'Online']),
			tech: z
				.array(z.string())
				.min(1, 'Proszę wybrać conajmniej jedną technologię'),
			cv: z.instanceof(FileList).refine(
				(fileList) => {
					if (fileList.length === 0) return false;
					const file = fileList[0];
					return file.type === 'image/jpeg' || file.type === 'image/png';
				},
				{
					message: 'Musisz dodać załącznik w formacie JPEG lub PNG.',
				}
			),
			hasExperience: z.boolean(),
			experience: z
				.array(
					z.object({
						tech: z.string(),
						experience: z.string(),
					})
				)
				.optional(),
		})
		.refine(
			(data) => {
				if (data.hasExperience) {
					return data.experience && data.experience.length > 0;
				}
				return true;
			},
			{
				message:
					'Gdy zaznaczono doświadczenie w programowaniu, lista dświadczeń nie może być pusta',
				path: ['experience'],
			}
		);

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm({ resolver: zodResolver(formSchema) });
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'experience',
	});

	function onSubmit(data) {
		setPage(data);
	}

	if (page === 0) {
		return (
			<>
				<div>
					<h1>Formularz zgłoszeniowy na kurs programowania</h1>
					<form onSubmit={handleSubmit(onSubmit)}>
						<section className={styles.personalData}>
							<h2>Dane osobowe</h2>
							<input
								{...register('name')}
								name='name'
								type='text'
								placeholder='Imię'
							/>
							{errors.name && (
								<p className={styles.error}>{errors.name.message}</p>
							)}
							<br />
							<input
								{...register('lastName')}
								name='lastName'
								type='text'
								placeholder='Nazwisko'
							/>
							{errors.lastName && (
								<p className={styles.error}>{errors.lastName.message}</p>
							)}
							<br />
							<input
								{...register('email')}
								name='email'
								type='text'
								placeholder='E-mail'
							/>
							{errors.email && (
								<p className={styles.error}>{errors.email.message}</p>
							)}
							<br />
							<input
								{...register('tel')}
								name='tel'
								type='text'
								placeholder='Numer telefonu'
							/>
							{errors.tel && (
								<p className={styles.error}>{errors.tel.message}</p>
							)}
						</section>
						<section>
							<h2>Preferencje kursu</h2>
							<p>
								Wybierz formę nauki:
								<input {...register('form')} value='Stacjonarna' type='radio' />
								Stacjonarna
								<input
									{...register('form')}
									value='Online'
									type='radio'
									defaultChecked
								/>
								Online
							</p>
							<select
								className={styles.select}
								{...register('tech')}
								size={5}
								multiple
							>
								{techList.map((tech) => (
									<option className={styles.option} key={tech} value={tech}>
										{tech}
									</option>
								))}
							</select>
							{errors.tech && (
								<p className={styles.error}>{errors.tech.message}</p>
							)}
						</section>
						<section>
							<h2>Dodaj swoje CV</h2>
							<input {...register('cv')} type='file' id='file' />
						</section>
						<section>
							<h2>Doświadczenie w programowaniu</h2>
							<p>
								<input
									{...register('hasExperience')}
									type='checkbox'
									onClick={handleCheckbox}
								/>
								Czy masz doświadczenie w programowaniu?
							</p>
							{checkbox && (
								<>
									<button
										className={styles.addExperience}
										type='button'
										onClick={() => append({ techName: '', techExperience: 0 })}
									>
										Dodaj doświadczenie
									</button>
									<br />
									{fields.map((item, index) => (
										<div className={styles.experienceRow} key={item.id}>
											<select {...register(`experience.${index}.tech`)}>
												{techList.map((el) => (
													<option key={el} value={el}>
														{el}
													</option>
												))}
											</select>
											<select {...register(`experience.${index}.experience`)}>
												{yearList.map((el) => (
													<option key={el} value={el}>
														{el}
													</option>
												))}
											</select>

											<button
												className={styles.deleteRow}
												type='button'
												onClick={() => remove(index)}
											>
												Usuń
											</button>
										</div>
									))}
									{errors.experience && <p>{errors.experience.message}</p>}
								</>
							)}
						</section>
						<div>
							<button className={styles.submit}>Wyślij zgłoszenie</button>
						</div>
					</form>
				</div>
			</>
		);
	} else {
		return (
			<>
				<Summary arr={page} />
			</>
		);
	}
};
export default FormComponent;
