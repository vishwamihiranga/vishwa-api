const zxcvbn = require('zxcvbn');

/**
 * Returns random tips from the given array of tips.
 * @param {Array} tipsArray - The array of tips to choose from.
 * @param {number} count - The number of random tips to return.
 * @returns {Array} - An array of randomly selected tips.
 */
const getRandomTips = (tipsArray, count) => {
  const shuffled = tipsArray.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

/**
 * Checks the strength of the given password.
 * @param {string} password - The password to check.
 * @returns {Object} - An object containing password strength, crack time, suggestions, and random tips.
 */
const checkPasswordStrength = (password) => {
  if (!password) {
    throw new Error('Password is required.');
  }

  // Check password strength using zxcvbn
  const result = zxcvbn(password);
  const score = result.score; // 0 to 4
  const crackTime = result.crack_times_display.offline_slow_hashing_1e4_per_second;

  // Determine password strength
  let strength;
  switch (score) {
    case 0:
    case 1:
      strength = 'Very Weak 🔴';
      break;
    case 2:
      strength = 'Weak 🟠';
      break;
    case 3:
      strength = 'Moderate 🟡';
      break;
    case 4:
      strength = 'Strong 🟢';
      break;
  }

  // Limit suggestions to 3
  const suggestions = result.feedback.suggestions.slice(0, 3);

  // Predefined tips
  const tips = [
      'Use a mix of uppercase and lowercase letters',
      'Include numbers and special characters',
      'Avoid common words or phrases',
      'Use a longer password (12+ characters)',
      'Use a unique password for each account',
      'Avoid using easily guessable information like your name or birthdate',
      'Do not reuse passwords across multiple accounts',
      'Include at least one number in your password',
      'Avoid common phrases or keyboard patterns (e.g., qwerty, 12345)',
      'Use a combination of random words that make sense to you',
      'Capitalize random letters in the password to increase complexity',
      'Avoid including your username in your password',
      'Avoid using dictionary words or their variations',
      'Create passwords that are hard for humans and computers to guess',
      'Add symbols in unexpected places, like @ instead of a or $ instead of s',
      'Use a passphrase instead of a single word (e.g., "SunnyDayInThePark!")',
      'Avoid using the same password for both personal and work accounts',
      'Use a password manager to store and generate complex passwords',
      'Never share your passwords with others',
      'Avoid writing passwords down in easily accessible places',
      'Use special characters in place of letters (e.g., replace "a" with "@")',
      'Avoid using consecutive characters like aaa or 111',
      'Avoid including your address or phone number in your password',
      'Avoid including your pet’s name in your password',
      'Use a longer password (16+ characters for sensitive accounts)',
      'Avoid repeating simple patterns like abcabc or 123123',
      'Do not use names of your family members in your password',
      'Use a mix of letters, numbers, and symbols for each password',
      'Update your passwords regularly to keep them secure',
      'Do not use the same root password with slight variations',
      'Consider using a password generator for more complex passwords',
      'Use a combination of unrelated words in a passphrase',
      'Create passwords that are hard to guess but easy for you to remember',
      'Enable two-factor authentication (2FA) on all accounts',
      'Don’t store your passwords in plain text files',
      'Never use "password" as your password',
      'Avoid using sequential letters or numbers (e.g., 1234, abcd)',
      'Use at least one symbol (e.g., @, #, $, &, *) in your passwords',
      'Don’t use easily accessible personal information in your password',
      'Avoid common combinations like "12345678" or "password123"',
      'Avoid using sports teams, celebrities, or favorite bands as passwords',
      'Use a password manager to generate and store complex passwords',
      'Consider using biometrics (fingerprint, face recognition) for extra security',
      'Avoid using variations of your name in passwords',
      'Do not use your birth year as part of your password',
      'Use a different password for each account to minimize risk',
      'Change your passwords at least once every six months',
      'Ensure your password is not too similar to previous ones',
      'Use mnemonic techniques to remember complex passwords',
      'Do not share your passwords through email or chat',
      'Use two or more random words combined to form a passphrase',
      'Avoid storing passwords on sticky notes or notebooks',
      'Avoid using outdated passwords that you no longer remember well',
      'Use complex passphrases for highly sensitive accounts',
      'Never store your passwords in your browser unless using encryption',
      'Enable automatic logout after inactivity on sensitive accounts',
      'Do not use predictable passwords like "admin" for administrative accounts',
      'Avoid using dates like your birthday or anniversary in passwords',
      'Use a password manager to securely store your passwords',
      'Set up security questions with answers that only you know',
      'Avoid using any part of your social security number in passwords',
      'Never use old passwords as new ones after a reset',
      'Avoid using passwords that are too short or too simple',
      'Ensure your password cannot be easily guessed by a friend or family member',
      'Use random capitalization throughout the password to increase complexity',
      'Never use your email address as part of your password',
      'Do not use keyboard patterns like "asdfgh" or "zxcvbn"',
      'Make sure each password is unpredictable and unique',
      'Use a secure connection (HTTPS) when entering your passwords online',
      'Avoid repeating the same password across different services',
      'Create a backup of your passwords using an encrypted password manager',
      'Avoid reusing old passwords that were compromised',
      'Use time-based one-time passwords (TOTP) for added security',
      'Ensure your password is at least 16 characters long for high-security accounts',
      'Do not use popular culture references in your passwords',
      'Consider using longer passphrases for better security',
      'Use password hints that only make sense to you',
      'Always enable multi-factor authentication where possible',
      'Use a hardware token for multi-factor authentication if available',
      'Avoid using birthdays, anniversaries, or other important dates in your password',
      'Use different symbols and numbers spread throughout the password',
      'Update passwords after any potential security breaches',
      'Avoid passwords related to your hobbies or favorite activities',
      'Use passwords that are random and avoid using patterns or repetition',
      'Use diceware or similar techniques to generate random passphrases',
      'Make sure your password is different from your username',
      'Use an offline password manager to avoid risks from cloud-based services',
      'Regularly audit your passwords for weak or reused ones',
      'Ensure you have secure backups for your password database',
      'Use a combination of lower and upper case characters with special symbols',
      'Change your password immediately after a security breach is announced',
      'Avoid using simple numbers like "2020" in your passwords',
      'Avoid storing your passwords in your browser’s autofill settings',
      'Use fake information for security questions, but remember your answers',
      'Create long, complex passwords for accounts with sensitive information',
      'Use different, random passwords for every service you use',
      'Avoid simple words, especially for important accounts like banking',
      'Create unique passwords for accounts that have access to sensitive data',
      'Regularly test your password strength with security tools',
      'Use password history tracking to avoid reusing old passwords',
      'Always check if your passwords are part of known breaches',
      'Avoid using any part of your phone number in passwords',
      'Enable alerts for failed login attempts to detect possible attacks',
      'Use two-step verification for additional security on all accounts',
      'Avoid using the same password for public and private accounts',
      'Use encryption software to store sensitive passwords securely',
      'Regularly change the passwords of your email and bank accounts',
      'Avoid entering your password on untrusted devices or networks',
      'Ensure no one is watching when entering your password in public places',
      'Use a secure password vault to manage all your passwords',
      'Enable biometric authentication where possible for an extra layer of security',
      'Use generated passphrases for added randomness and complexity',
      'Avoid using your nickname in passwords',
      'Avoid using predictable numbers like "2468" or "13579"',
      'Avoid passwords with repeated sequences like "abcabc" or "1212"',
      'Test your password against online password strength checkers',
      'Do not use favorite book or movie titles as passwords',
      'Keep your password database encrypted and securely backed up',
      'Ensure your password recovery options are secure',
      'Use strong passwords for all devices, not just online accounts',
      'Do not save passwords in plain text on your desktop',
      'Use unique passwords for critical systems like your main email and banking',
      'Use phrases that make sense only to you but are hard for others to guess',
      'Create a different password for your social media accounts',
      'Use randomly generated passwords for maximum security',
      'Create a system to periodically update your passwords',
      'Avoid using commonly known facts about yourself in passwords',
      'Change your passwords after any suspicious activity on your accounts',
      'Don’t let anyone see you typing in your password in public areas',
      'Use password-protected vaults to manage all passwords securely',
      'Avoid using passwords with sequential numbers like "6789"',
      'Use symbols and numbers in unexpected places within the password',
      'Enable a password lockout after multiple failed login attempts',
      'Avoid storing your passwords on unencrypted devices',
      'Use completely different passwords for different types of accounts',
      'Enable alerts for password reset requests on your accounts',
      'Avoid using your home address in any passwords',
      'Use complex passwords for online shopping and payment accounts',
      'Always use a new password after a reset or recovery process',
      'Avoid using simple names like "john" or "jane" in passwords',
      'Ensure passwords for work accounts differ from personal accounts',
      'Check if your passwords have been exposed in known data breaches',
      'Use a combination of uncommon words and numbers in passphrases',
      'Use passwords that would be hard for even a close friend to guess',
      'Always have a backup of your password vault, encrypted securely',
      'Do not store passwords in online notes or documents',
      'Make your passwords long but easy for you to remember',
      'Do not use passwords based on memorable dates',
      'Avoid reusing passwords that were leaked in data breaches',
      'Use a dedicated password for your email provider',
      'Consider using a yubikey or similar hardware token for extra security',
      'Use a passphrase made of four random words for additional complexity',
      'Avoid using partial passwords from old, reused passwords',
      'Always use complex passwords for cloud storage services',
      'Avoid using numbers related to your age or birth year',
      'Regularly audit and update your password manager for security',
      'Do not use passwords that were part of a previous breach or hack'
    ];

  // Get 3 or 4 random tips
  const randomTips = getRandomTips(tips, Math.floor(Math.random() * 2) + 3);

  // Construct the response object
  return {
    strength,
    crackTime,
    suggestions,
    tips: randomTips
  };
};

// Export the function
module.exports = {
  checkPasswordStrength,
};
