using API.DTO;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class MessagesController(
    IMessageRepository messageRepository,
    IUserRepository userRepository,
    IMapper mapper) : BaseAPIController
{
    [HttpPost]
    public async Task<ActionResult<MessageDTO>> CreateMessage(CreateMessageDTO createMessageDTO)
    {
        var username = User.GetUsername();
        if (username == createMessageDTO.RecipientUsername.ToLower())
            return BadRequest("You can`t write yourself");

        var sender = await userRepository.GetUserByUsernameAsync(username);
        var recipient = await userRepository.GetUserByUsernameAsync(createMessageDTO.RecipientUsername);
        if (recipient == null || sender == null || sender.UserName == null || recipient.UserName == null) return BadRequest("Cannot send message at this time");

        var message = new Message
        {
            Sender = sender,
            Recipient = recipient,
            SenderUsername = sender.UserName,
            RecipientUsername = recipient.UserName,
            Content = createMessageDTO.Content

        };
        messageRepository.AddMessage(message);
        if (await messageRepository.SaveAllAsync()) return Ok(mapper.Map<MessageDTO>(message));

        return BadRequest("Fail on save message");

    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MessageDTO>>> GetMessages([FromQuery] MessageParams messageParams)
    {
        messageParams.UserName = User.GetUsername();

        var messages = await messageRepository.GetMessagesForUser(messageParams);
        Response.AddPaginationHeader(messages);
        return messages;
    }

    [HttpGet("thread/{username}")]

    public async Task<ActionResult<IEnumerable<MessageDTO>>> GetMessageThread(string username)
    {
        var currentUsername = User.GetUsername();
        return Ok(await messageRepository.GetMessageThread(currentUsername, username));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteMessage(int id)
    {
        var username = User.GetUsername();
        var message = await messageRepository.GetMessage(id);
        if (message == null) return BadRequest("cannot delete this message");
        if (message.SenderUsername != username && message.RecipientUsername != username) return Forbid();
        if (message.SenderUsername == username) message.SenderDeleted = true;
        if (message.RecipientUsername == username) message.RecipientDeleted = true;
        if (message is { SenderDeleted: true, RecipientDeleted: true })
        {
            messageRepository.DeleteMessage(message);
        }
        if (await messageRepository.SaveAllAsync()) return Ok();
        return BadRequest("Problem with deleting the message");

    }
}
