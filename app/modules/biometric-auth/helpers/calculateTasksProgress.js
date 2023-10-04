function calculateCompletionPercentage(tasks) {
	if (tasks.hasOwnProperty('registration')) {
		delete tasks.registration;
	}

	let totalTasks = Object.keys(tasks).length;
	if (tasks?.face_liveliness) {
		totalTasks += Object.keys(tasks.face_liveliness).length;
	}

	if (totalTasks === 0) {
		return 0;
	}

	let totalScore = 0;
	let completedScore = 0;

	for (const taskName in tasks) {
		if (typeof tasks[taskName] === 'number') {
			const currentScore = tasks[taskName];
			totalScore += 100;
			completedScore += +currentScore;
		} else if (typeof tasks[taskName] === 'object') {
			const currentScore = tasks[taskName]?.current_score || 0;
			const targetScore = tasks[taskName]?.target_score || 100;
			totalScore += targetScore;
			if (currentScore >= targetScore) {
				completedScore += targetScore;
			} else {
				completedScore += (currentScore / targetScore) * targetScore;
			}
		}
	}

	if (tasks?.face_liveliness) {
		const deepTasks = tasks.face_liveliness;
		for (const taskName in deepTasks) {
			const currentScore = deepTasks[taskName]?.current_score || 0;
			const targetScore = deepTasks[taskName]?.target_score || 0;
			totalScore += targetScore;
			if (currentScore >= targetScore) {
				completedScore += targetScore;
			} else {
				completedScore += (currentScore / targetScore) * targetScore;
			}
		}
	}

	const completionPercentage = completedScore / totalScore || 0;

	if (completionPercentage === 1) {
		return 1;
	}

	console.log('total tasks: ', totalTasks);
	console.log('total score: ', totalScore);
	console.log('completed score: ', completedScore);

	return completionPercentage;
}

export default calculateCompletionPercentage;
